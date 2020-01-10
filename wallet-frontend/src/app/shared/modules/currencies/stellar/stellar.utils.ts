import { combineLatest, from, Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
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
import { FromDecimal, IBlockchainService, SignTransactionParams, ToDecimal } from '../../../shared.module';
import { Stellar } from '../../../DomainCurrency';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { EthereumDecimals } from '../ethereum.utils';

export const StellarDecimals = 7;

const fee = 1000;

function payment(privateKey: string, params: SignTransactionParams, account: AccountResponse, memo: Memo): Transaction {
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

function createAccount(privateKey: string, params: SignTransactionParams, account: AccountResponse, memo: Memo): Transaction {
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

export class StellarUtils implements IBlockchainService {

  private network;
  private currency = Stellar.Instance();

  constructor(private readonly privateKey: string, private blockchainUtils: NodeApiProvider) {
    this.network = new Server('https://horizon.stellar.org');
  }

  getAddress(seed: string): string {
    const keyPair = this.getKeyPairFromSeed(seed);
    return StrKey.encodeEd25519PublicKey(keyPair.rawPublicKey());
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return FromDecimal(x, StellarDecimals).toNumber();
      }));
  }

  signTransaction$(params: SignTransactionParams): Observable<Transaction> {
    const fromAddress = this.getAddress(this.privateKey);

    const accountTo$ = this.getAccount(params.toAddress);
    const accountFrom$ = from(this.network.loadAccount(fromAddress));

    return combineLatest(accountTo$, accountFrom$).pipe(
      map(([accountTo, accountFrom]: [AccountResponse, AccountResponse]) => {
          const memo: Memo = Memo.fromXDRObject(Memo.text(!params.memo ? 'BUTTON Wallet' : params.memo).toXDRObject());
          params.amount = (+params.amount).toFixed(7).toString();
          return !accountTo
            ? createAccount(this.privateKey, params, accountFrom, memo)
            : payment(this.privateKey, params, accountFrom, memo);
        }
      )
    );
  }

  sendTransaction$(rawTransaction: string | Transaction, guid: string): Observable<string> {
    if (rawTransaction instanceof Transaction) {
      rawTransaction = rawTransaction.toEnvelope().toXDR().toString('base64');
    }
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private getKeyPairFromSeed(seed: string): Keypair {
    return Keypair.fromSecret(seed);
  }

  private getAccount(address: string): Observable<AccountResponse> {
    return from(this.network.loadAccount(address))
      .pipe(
        map((account: AccountResponse) => account),
        catchError(() => of(null))
      );
  }
}
