import { IBlockchainService } from '../../../shared.module';
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import {
  IBlockchain,
  StellarTransactionParams
} from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FromDecimal } from '../../../../../../../lib/ts-wallet-core/src/blockchain.utils';
import { StellarDecimals } from '../../../../../../../lib/ts-wallet-core/src/currencies/currenciesUtils/stellar.utils';

export class StellarService implements IBlockchainService {

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

  getBalance$(address: string, guid: string): Observable<number> {
    return this.nodeApiProvider.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return FromDecimal(x, StellarDecimals).toNumber();
      }));
  }

  signTransaction$(params: StellarTransactionParams, guid: string): Observable<string> {
      params.memo = 'BUTTON Wallet';
      return this.blockchain.signTransaction$(params);
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, rawTransaction, guid);
  }
}
