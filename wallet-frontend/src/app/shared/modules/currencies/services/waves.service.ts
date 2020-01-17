import { from, Observable } from 'rxjs';
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

  signTransaction$(params: WavesTransactionParams): Observable<string> {
    return from(this.blockchain.signTransaction$(params));
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, String(rawTransaction), guid);
  }

}
