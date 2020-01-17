import {
  Networks,
  Server,
  Keypair,
  StrKey,
  TransactionBuilder,
  AccountResponse,
  Operation,
  Asset,
  Memo,
  Transaction
} from 'stellar-sdk'
import { ICurrency, StellarTransactionParams } from '../../types'

export function Stellar(privateKey: string): ICurrency {
  return new StellarCurrency(privateKey)
}

const fee = 1000

export class StellarCurrency implements ICurrency {
  private network: any

  constructor(private readonly privateKey: string) {
    this.network = new Server('https://horizon.stellar.org')
  }

  getAddress(privateKey: string): string {
    const keyPair = this.getKeyPairFromSeed(privateKey)
    return StrKey.encodeEd25519PublicKey(keyPair.rawPublicKey())
  }

  signTransaction(params: StellarTransactionParams): Promise<string> {
    const fromAddress = this.getAddress(this.privateKey)

    const accountTo$: Promise<AccountResponse | null> = this.getAccount(params.toAddress)
    const accountFrom$: Promise<AccountResponse | null> = this.getAccount(fromAddress)

    return Promise.all([accountTo$, accountFrom$]).then(
      ([accountTo, accountFrom]: [AccountResponse | null, AccountResponse | null]) => {
        if (accountFrom === null) {
          throw new Error('account from not exists')
        }
        const memo: Memo = Memo.fromXDRObject(
          Memo.text(!params.memo ? 'BUTTON Wallet' : params.memo).toXDRObject()
        )
        params.amount = (+params.amount).toFixed(7).toString()
        const signedTx = !accountTo
          ? createAccount(this.privateKey, params, accountFrom, memo)
          : payment(this.privateKey, params, accountFrom, memo)
        return signedTx
          .toEnvelope()
          .toXDR()
          .toString('base64')
      }
    )
  }

  private getKeyPairFromSeed(seed: string): Keypair {
    return Keypair.fromSecret(seed)
  }

  private getAccount(address: string): Promise<AccountResponse | null> {
    const account: Promise<AccountResponse> = this.network.loadAccount(address)
    return account
      .then((account: AccountResponse) => account)
      .catch(() => {
        return null
      })
  }
}

function payment(
  privateKey: string,
  params: StellarTransactionParams,
  account: AccountResponse,
  memo: Memo
): Transaction {
  const transaction = new TransactionBuilder(account, {
    fee,
    memo,
    networkPassphrase: Networks.PUBLIC
  })
    .addOperation(
      Operation.payment({
        destination: params.toAddress,
        asset: Asset.native(),
        amount: params.amount
      })
    )
    .setTimeout(9999999999999)
    .build()

  transaction.sign(Keypair.fromSecret(privateKey))
  return transaction
}

function createAccount(
  privateKey: string,
  params: StellarTransactionParams,
  account: AccountResponse,
  memo: Memo
): Transaction {
  if (+params.amount < 1) {
    throw new Error('Start balance should be at least 1')
  }

  const transaction = new TransactionBuilder(account, {
    fee,
    memo,
    networkPassphrase: Networks.PUBLIC
  })
    .addOperation(
      Operation.createAccount({
        destination: params.toAddress,
        startingBalance: params.amount
      })
    )
    .setTimeout(9999999999999)
    .build()

  transaction.sign(Keypair.fromSecret(privateKey))
  return transaction
}
