import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
} from 'stellar-sdk';
import { IBlockchain, StellarTransactionParams } from '../../typings/ts-wallet-core.dto';

export const StellarDecimals = 7;

const fee = 1000;

function payment(privateKey: string, params: StellarTransactionParams, account: AccountResponse, memo: Memo): Transaction {
  const transaction = new TransactionBuilder(account, { fee, memo, networkPassphrase: Networks.PUBLIC })
    .addOperation(Operation.payment({
      destination: params.toAddress,
      asset: Asset.native(),
      amount: params.amount
    }))
    .setTimeout(9999999999999)
    .build();

  transaction.sign(Keypair.fromSecret(privateKey));
  return transaction;
}

function createAccount(privateKey: string, params: StellarTransactionParams, account: AccountResponse, memo: Memo): Transaction {
  if (+params.amount < 1) {
    throw new Error('Start balance should be at least 1');
  }

  const transaction = new TransactionBuilder(account, { fee, memo, networkPassphrase: Networks.PUBLIC })
    .addOperation(Operation.createAccount({
      destination: params.toAddress,
      startingBalance: params.amount
    }))
    .setTimeout(9999999999999)
    .build();

  transaction.sign(Keypair.fromSecret(privateKey));
  return transaction;
}

export class StellarUtils implements IBlockchain {

  private network: any;

  constructor(private readonly privateKey: string) {
    this.network = new Server('https://horizon.stellar.org');
  }

  getAddress(privateKey: string): string {
    const keyPair = this.getKeyPairFromSeed(privateKey);
    return StrKey.encodeEd25519PublicKey(keyPair.rawPublicKey());
  }

  signTransaction$(params: StellarTransactionParams): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const accountTo$: Observable<AccountResponse | null> = this.getAccount(params.toAddress);
    const accountFrom$: Observable<AccountResponse | null> = this.getAccount(fromAddress);

    return combineLatest(accountTo$, accountFrom$).pipe(
      map(([accountTo, accountFrom]: [AccountResponse | null, AccountResponse | null]) => {
          if (accountFrom === null) {
            throw new Error('account from not exists');
          }
          const memo: Memo = Memo.fromXDRObject(Memo.text(!params.memo ? 'BUTTON Wallet' : params.memo).toXDRObject());
          params.amount = (+params.amount).toFixed(7).toString();
          const transactionToSign = !accountTo
            ? createAccount(this.privateKey, params, accountFrom, memo)
            : payment(this.privateKey, params, accountFrom, memo);
          return JSON.stringify(transactionToSign);
        }
      )
    );
  }

  private getKeyPairFromSeed(seed: string): Keypair {
    return Keypair.fromSecret(seed);
  }

  private getAccount(address: string): Observable<AccountResponse | null> {
    const account: Promise<AccountResponse> = this.network.loadAccount(address);
    return from(account)
      .pipe(
        map((account: AccountResponse) => account),
        catchError(() => of(null))
      );
  }
}
