import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import { EthereumUtils } from './ethereum.utils';
import { Ethereum, EthereumClassic } from '../../DomainCurrency';
import { NodeApiProvider } from '../../providers/node-api.provider';
import { ContractCall, IContractService, SignTransactionParams } from '../../shared.module';
import { Observable } from 'rxjs';

export interface TxConfig {
  to: string;
  data: string;
  from?: string;
  gas?: number;
  value?: string;
  gasPrice?: string;
}

export class EthereumContractUtils extends EthereumUtils implements IContractService {

  private web3: Web3;

  constructor(private readonly privateKey: string, private readonly fromAddress: string,
              blockchainUtils: NodeApiProvider, currency: Ethereum | EthereumClassic, private rpcEndpoint?: string) {
    super(privateKey, fromAddress, blockchainUtils, currency);
    this.web3 = this.getProvider(rpcEndpoint);
  }

  getInstance(abi: AbiItem[], contractAddress: string): Contract {
    return new this.web3.eth.Contract(abi, contractAddress);
  }

  getCallData(params: ContractCall) {
    if (!params.contractInstance.methods[params.methodName]) {
      throw new Error(`Method ${params.methodName} does not exist`);
    }
    return params.contractInstance.methods[params.methodName](...params.executionParameters).encodeABI();
  }

  estimateGasRawData$(params: TxConfig): Promise<number> {
    const txConfig: TransactionConfig = {
      to: params.to,
      data: params.data,
      from: !params.from ? '0x0000000000000000000000000000000000000000' : params.from,
      gas: !params.gas ? '0x6ACFC0' : this.decimalToHex(params.gas),                  // 7_000_000
      gasPrice: !params.gasPrice ? '0xB2D05E00' : this.decimalToHex(params.gasPrice), // 3_000_000_000
      value: !params.value ? '0' : this.decimalToHex(params.value)
    };
    return this.web3.eth.estimateGas(txConfig);
  }

  callMethod$(params: ContractCall): Observable<any> {
    return params.contractInstance.methods[params.methodName](...params.executionParameters).call({ from: params.addressFrom });
  }

  async setValue$(params: ContractCall, guid: string, isSync: boolean = false): Promise<string> {
    const data = this.getCallData(params);
    const gasPrice = !params.gasPrice ? await this.blockchainUtils.getGasPrice$(this.currency, guid).toPromise() : params.gasPrice;
    const gasLimit = !params.gasLimit
      ? await this.blockchainUtils.getGasLimit$(this.currency, params.contractAddress, data.substring(2), guid).toPromise()
      : params.gasLimit;

    const signingData: SignTransactionParams = {
      privateKey: this.privateKey,
      toAddress: params.contractAddress,
      amount: !params.amount ? '0' : params.amount,
      gasLimit,
      gasPrice,
      data
    };

    const signedTx = await this.signTransaction$(signingData, guid);
    const hash = await this.sendTransaction$(signedTx, guid).toPromise();
    if (isSync) {
      await this.awaitTx$(hash);
    }
    return hash;
  }

  awaitTx$(txnHash: Array<string> | string): Promise<any> | Promise<any[]> {
    if (Array.isArray(txnHash)) {
      const promises = [];
      txnHash.forEach((oneTxHash) => {
        promises.push(this.awaitTx$(oneTxHash));
      });
      return Promise.all(promises);
    } else {
      return new Promise((resolve, reject) => {
        this.transactionReceiptAsync(txnHash, resolve, reject);
      });
    }
  }

  private async transactionReceiptAsync(txnHash: string, resolve, reject): Promise<void> {
    const interval = 2000;
    const blocksToWait = 1;

    console.log('wait for tx first confirmation');
    try {
      const receipt = this.web3.eth.getTransactionReceipt(txnHash);
      if (!receipt) {
        setTimeout(() => {
          this.transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        if (blocksToWait > 0) {
          const resolvedReceipt = await receipt;
          if (!resolvedReceipt || !resolvedReceipt.blockNumber) {
            setTimeout(() => {
              this.transactionReceiptAsync(txnHash, resolve, reject);
            }, interval);
          } else {
            try {
              const block = await this.web3.eth.getBlock(resolvedReceipt.blockNumber);
              const current = await this.web3.eth.getBlock('latest');
              if (current.number - block.number >= blocksToWait) {
                const txn = await this.web3.eth.getTransaction(txnHash);
                if (txn.blockNumber != null) {
                  resolve(resolvedReceipt);
                } else {
                  reject(new Error('Transaction with hash: ' + txnHash + ' ended up in an uncle block.'));
                }
              } else {
                setTimeout(() => {
                  this.transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
              }
            } catch (e) {
              setTimeout(() => {
                this.transactionReceiptAsync(txnHash, resolve, reject);
              }, interval);
            }
          }
        } else {
          resolve(receipt);
        }
      }
    } catch (e) {
      reject(e);
    }
  }

  private getProvider(rpcEndpoint: string): Web3 {
    if (rpcEndpoint) {
      return new Web3(rpcEndpoint);
    }

    switch (this.currency.short) {
      case 'etc':
        return new Web3('https://ethereumclassic.network');
      case 'eth':
        return new Web3('https://mainnet.infura.io/1u84gV2YFYHHTTnh8uVl');
    }
  }

  decimalToHex(d: number | string): string {
    let hex = this.blockchainUtils.tbn(d).toString(16);
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  }
}
