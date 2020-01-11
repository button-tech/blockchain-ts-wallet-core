import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {IBlockchainService, SignTransactionParams} from '../../shared.module';
import {NodeApiProvider} from '../../providers/node-api.provider';
import {TON} from '../../DomainCurrency';
import {environment} from '../../../../environments/environment.prod';

export class TonUtils implements IBlockchainService {
  constructor(private readonly privateKey: string,
              protected blockchainUtils: NodeApiProvider, protected currency: TON) {
  }

  async getAddress(privateKey: string, workChain: string, guid: string): Observable<string> {
    const bufferPK = this.hexToBuffer(privateKey);
    const keyPair = (window as any).nacl.sign.keyPair.fromSeed(bufferPK);
    const address = await (window as any).wallet_creation_generate_external_message(keyPair, workChain);
    const hexAddress = address[0];
    return this.blockchainUtils.getTonAddressInfo$(hexAddress, guid)
      .pipe(map(info => {
        return info.shortAddress;
      }));
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return +x;
      }));
  }

  async signTransaction$(params: SignTransactionParams, workChain: string, guid: string): Observable<string> {
    return await(window as any).sign(this.privateKey, params.toAddress,
      params.amount,
      workChain,
      environment.nodeEndpoint
    );
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private hexToBuffer(s: string): Buffer {
    return new Buffer(s, 'hex');
  }
}
