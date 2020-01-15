import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import {
  EthereumTransactionParams,
  IBlockchain
} from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';
import { IBlockchainService } from '../../../shared.module';
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { FromDecimal } from '../../../../../../../lib/ts-wallet-core/src/blockchain.utils';
import { CustomFeeResponse } from '../../../dto/node-api.dto';
import { EthereumDecimals } from '../../../../../../../lib/ts-wallet-core/src/currencies/currenciesUtils/ethereum.utils';


export class EthereumBasedService implements IBlockchainService {

  constructor(
    protected privateKey: string,
    protected currency: IDomainCurrency,
    protected blockchain: IBlockchain,
    protected nodeApiProvider: INodeApiProvider,
  ) {
  }

  getAddress(privateKey: string): string {
    return this.blockchain.getAddress(privateKey);
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.nodeApiProvider.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return FromDecimal(x, EthereumDecimals).toNumber();
      }));
  }

  signTransaction$(params: EthereumTransactionParams, guid: string): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const feeObj$ = this.nodeApiProvider.getCustomFee$(this.currency, fromAddress, params.amount, guid);
    const nonce$ = this.nodeApiProvider.getNonce$(this.currency, fromAddress, guid);

    return combineLatest(nonce$, feeObj$).pipe(
      mergeMap(([nonce, feeObj]: [number, CustomFeeResponse]) => {
        params.nonce = nonce;
        params.gasPrice = feeObj.gasPrice;
        params.gasLimit = 21000;
        return this.blockchain.signTransaction$(params);
      })
    );
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, rawTransaction, guid);
  }
}
