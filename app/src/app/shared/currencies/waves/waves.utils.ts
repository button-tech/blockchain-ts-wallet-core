import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { transfer } from 'waves-transactions';
import { ITransferTransaction } from 'waves-transactions/transactions';
import { address } from '@waves/ts-lib-crypto';
import { IBlockchainService, SignTransactionParams } from '../../../send/send.module';
import { BlockchainUtilsService } from '../../blockchainUtils.service';
import { Waves } from '../../DomainCurrency';

export const WavesDecimals = 8;

export class WavesUtils implements IBlockchainService {

  private currency: Waves = Waves.Instance();

  constructor(private blockchainUtils: BlockchainUtilsService) {
  }

  getAddress(privateKey: string): string {
    return address(privateKey);
  }

  getBalance$(addr: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, addr, guid)
      .pipe(map(x => {
        return this.blockchainUtils.fromDecimal(x, WavesDecimals).toNumber();
      }));
  }

  signTransaction$(params: SignTransactionParams, guid: string): Promise<ITransferTransaction> {
    const timestamp = Date.now();
    const signedTx: ITransferTransaction = transfer({
      amount: +params.amount,
      recipient: params.toAddress,
      timestamp,
    }, params.privateKey);

    return Promise.resolve(signedTx);
  }

  sendTransaction$(rawTransaction: string | ITransferTransaction, guid: string): Observable<string> {
    if (rawTransaction === 'object') {
      rawTransaction = JSON.stringify(rawTransaction);
    }
    return this.blockchainUtils.sendTx$(this.currency, String(rawTransaction), guid);
  }


}
