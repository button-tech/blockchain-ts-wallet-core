import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { IBlockchainService, SignTransactionParams } from '../../shared.module';
import { NodeApiProvider } from '../../providers/node-api.provider';
import { TON } from '../../DomainCurrency';
import { environment } from '../../../../environments/environment.prod';

export class TonUtils implements IBlockchainService {
  constructor(private readonly privateKey: string,
              protected blockchainUtils: NodeApiProvider, protected currency: TON) {
  }

  getAddress(privateKey: string): string {
    // const bufferPK = this.hexToBuffer(privateKey);
    // const keyPair = window.nacl.sign.keyPair.fromSeed(bufferPK);
    // const address = await window.wallet_creation_generate_external_message(keyPair, workChain);
    // const hexAddress = address[0];
    // return this.blockchainUtils.getTonAddressInfo$(hexAddress, guid)
    //   .pipe(map(info => {
    //     return info.shortAddress;
    //   }));
    return '';
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return +x;
      }));
  }

  signTransaction$(params: SignTransactionParams, guid: string): Observable<string> {
    return from(window.sign(this.privateKey, params.toAddress,
      params.amount,
      '-1',
      environment.nodeEndpoint
    ));
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private hexToBuffer(s: string): Buffer {
    return new Buffer(s, 'hex');
  }
}
