import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITransferTransaction } from 'waves-transactions/transactions';
import { IBlockchainService } from '../../../shared.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { IBlockchain, WavesTransactionParams } from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';
import { WavesDecimals } from '../../../../../../../lib/ts-wallet-core/src/currencies/currenciesUtils/waves.utils';
import { FromDecimal } from '../../../../../../../lib/ts-wallet-core/src/blockchain.utils';

export class WavesService implements IBlockchainService {

  constructor(
    private privateKey: string,
    private currency: IDomainCurrency,
    private blockchain: IBlockchain,
    private nodeApiProvider: INodeApiProvider,
  ) {
  }

  getAddress(privateKey: string): string {
    return this.blockchain.getAddress(privateKey);
  }

  getBalance$(addr: string, guid: string): Observable<number> {
    return this.nodeApiProvider.getBalance$(this.currency, addr, guid)
      .pipe(map(x => {
        return FromDecimal(x, WavesDecimals).toNumber();
      }));
  }

  signTransaction$(params: WavesTransactionParams): Observable<ITransferTransaction> {
    return this.blockchain.signTransaction$(params);
  }

  sendTransaction$(rawTransaction: string | ITransferTransaction, guid: string): Observable<string> {
    if (typeof rawTransaction === 'object') {
      rawTransaction = JSON.stringify(rawTransaction);
    }
    return this.nodeApiProvider.sendTx$(this.currency, String(rawTransaction), guid);
  }

}
