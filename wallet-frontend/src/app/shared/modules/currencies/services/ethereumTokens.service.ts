import { combineLatest, from, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import {
  ContractCall,
  IAccount, IContract, TxConfig
} from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';
import { IContractService } from '../../../shared.module';
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { EthereumBasedService } from './ethereumBased.service';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { CustomFeeResponse } from '../../../dto/node-api.dto';
import { EthereumTransactionParams } from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';


export class EthereumTokensService extends EthereumBasedService implements IContractService {

  constructor(
    privateKey: string,
    currency: IDomainCurrency,
    private tokens: IAccount & IContract,
    nodeApiProvider: INodeApiProvider,
  ) {
    super(privateKey, currency, tokens, nodeApiProvider);
  }

  getInstance(abi: AbiItem[], contractAddress: string): Contract {
    return this.tokens.getInstance(abi, contractAddress);
  }

  callMethod$(params: ContractCall): Observable<any> {
    return from(this.tokens.callMethod$(params));
  }

  estimateGasRawData$(params: TxConfig): Observable<number> {
    return from(this.tokens.estimateGasRawData$(params));
  }

  setValue$(params: ContractCall, guid: string, isSync: boolean = false): Observable<string> {
    const data = this.tokens.getCallData(params);

    const fromAddress = this.getAddress(this.privateKey);

    const feeObj$ = this.nodeApiProvider.getCustomFee$(this.currency, fromAddress, params.amount, guid);
    const nonce$ = this.nodeApiProvider.getNonce$(this.currency, fromAddress, guid);
    const gasLimit$ = this.nodeApiProvider.getGasLimit$(this.currency, params.contractAddress, data.substring(2), guid);

    return combineLatest(nonce$, feeObj$, gasLimit$).pipe(
      mergeMap(([nonce, feeObj, gasLimit]: [number, CustomFeeResponse, number]) => {
        const ethParams: EthereumTransactionParams = {
          nonce,
          gasLimit,
          data,
          gasPrice: feeObj.gasPrice,
          toAddress: params.contractAddress,
          amount: params.amount
        };
        return this.tokens.signTransaction$(ethParams);
      })
    );
  }

  awaitTx$(txnHash: Array<string> | string): Promise<any> | Promise<any[]> {
    return this.tokens.awaitTx$(txnHash);
  }

}
