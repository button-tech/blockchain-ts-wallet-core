import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IBlockchain, UtxoTransactionParams } from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';
import { UtxoDecimals } from '../../../../../../../lib/ts-wallet-core/src/currencies/currenciesUtils/utxoBased.utils';
import { IBlockchainService } from '../../../shared.module';
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { FromDecimal } from '../../../../../../../lib/ts-wallet-core/src/blockchain.utils';


export class UtxoBasedService implements IBlockchainService {

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
        return FromDecimal(x, UtxoDecimals).toNumber();
      }));
  }

  signTransaction$(params: UtxoTransactionParams, guid: string): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey);

    return this.nodeApiProvider.getCustomFee$(this.currency, fromAddress, params.amount, guid)
      .pipe(
        mergeMap((feeObj) => {
          params.fee = feeObj.fee;
          params.inputs = feeObj.inputs;
          return this.blockchain.signTransaction$(params);
        })
      );
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, rawTransaction, guid);
  }
}
