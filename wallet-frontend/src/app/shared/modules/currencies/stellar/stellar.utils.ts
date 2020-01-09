import { from, Observable, of } from 'rxjs';
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
import { IBlockchainService, SignTransactionParams } from '../../../shared.module';
import { Stellar } from '../../../DomainCurrency';
import { NodeApiProvider } from '../../../providers/node-api.provider';

export const StellarDecimals = 9;

const fee = 1000;

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
        return this.blockchainUtils.fromDecimal(x, StellarDecimals).toNumber();
      }));
  }

  async signTransaction$(params: SignTransactionParams): Promise<Transaction> {
    const fromAddress = this.getAddress(this.privateKey);

    const accountTo = await this.getAccount(params.toAddress).toPromise();
    const accountFrom = await this.network.loadAccount(fromAddress);
    const memo: Memo = Memo.fromXDRObject(Memo.text(!params.memo ? 'BUTTON Wallet' : params.memo).toXDRObject());
    if (!accountTo) {
      return this.createAccount(params, accountFrom, memo);
    }
    return await this.payment(params, accountFrom, memo);
  }

  sendTransaction$(rawTransaction: string | Transaction, guid: string): Observable<string> {
    if (rawTransaction instanceof Transaction) {
      rawTransaction = rawTransaction.toEnvelope().toXDR().toString('base64');
    }
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private payment(params: SignTransactionParams, account: AccountResponse, memo: Memo): Transaction {
    const transaction = new TransactionBuilder(account, { fee, memo, networkPassphrase: Networks.PUBLIC })
      .addOperation(Operation.payment({
        destination: params.toAddress,
        asset: Asset.native(),
        amount: params.amount
      }))
      .setTimeout(9999999999999)
      .build();

    transaction.sign(Keypair.fromSecret(this.privateKey));
    return transaction;
  }

  private createAccount(params: SignTransactionParams, account: AccountResponse, memo: Memo): Transaction {
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

    transaction.sign(Keypair.fromSecret(this.privateKey));
    return transaction;
  }

  private getKeyPairFromSeed(seed: string): Keypair {
    return Keypair.fromSecret(seed);
  }

  private getAccount(address: string): Observable<AccountResponse | boolean> {
    return from(this.network.loadAccount(address))
      .pipe(
        map((account: AccountResponse) => account),
        catchError(() => of(false))
      );
  }
}
