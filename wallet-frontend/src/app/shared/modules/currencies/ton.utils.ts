import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IBlockchainService, SignTransactionParams } from '../../shared.module';
import { NodeApiProvider } from '../../providers/node-api.provider';
import {TON} from '../../DomainCurrency';

export class TonUtils implements IBlockchainService {
  constructor(private readonly privateKey: string,
              protected blockchainUtils: NodeApiProvider, protected currency: TON, ) {
  }

  getAddress(privateKey: string): string {
    // getAddress
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return +x;
      }));
  }

  signTransaction$(params: SignTransactionParams, guid: string): Observable<string>{
    // sign
  }
  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }
}
