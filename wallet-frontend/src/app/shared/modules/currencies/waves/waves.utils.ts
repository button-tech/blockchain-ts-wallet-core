import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { transfer } from 'waves-transactions';
import { ITransferTransaction } from 'waves-transactions/transactions';
import { address } from '@waves/ts-lib-crypto';
import { FromDecimal, IBlockchainService, SignTransactionParams } from '../../../shared.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { Waves } from '../../../DomainCurrency';
import { StellarDecimals } from '../stellar/stellar.utils';

export const WavesDecimals = 8;

export class WavesUtils implements IBlockchainService {

  private currency: Waves = Waves.Instance();

  constructor(private readonly privateKey: string, private blockchainUtils: NodeApiProvider) {
  }

  getAddress(privateKey: string): string {
    return address(privateKey);
  }

  getBalance$(addr: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, addr, guid)
      .pipe(map(x => {
        return FromDecimal(x, WavesDecimals).toNumber();
      }));
  }

  signTransaction$(params: SignTransactionParams, guid: string): Observable<ITransferTransaction> {
    const timestamp = Date.now();
    const signedTx: ITransferTransaction = transfer({
      amount: FromDecimal(params.amount, WavesDecimals).toNumber(),
      recipient: params.toAddress,
      timestamp,
    }, this.privateKey);

    return of(signedTx);
  }

  sendTransaction$(rawTransaction: string | ITransferTransaction, guid: string): Observable<string> {
    if (typeof rawTransaction === 'object') {
      rawTransaction = JSON.stringify(rawTransaction);
    }
    return this.blockchainUtils.sendTx$(this.currency, String(rawTransaction), guid);
  }


}
