import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import { AbiItem } from 'web3-utils';
import { Contract } from 'web3-eth-contract';
import {
  ContractCall,
  ICurrency,
  IContract,
  TxConfig,
  MnemonicDescriptor,
  currencyFactory
} from '../../types';
import { DecimalToHex } from '../../blockchain.utils';
import { EthereumBasedCurrency } from './ethereumBased';
import { getSecp256k1KeyPair } from '../../hd-wallet';
import { DomainEthereum, DomainEthereumClassic } from '../../DomainCurrency';

export const EthereumTokens = (secret: string | MnemonicDescriptor): ICurrency & IContract =>
  currencyFactory({
    currency: DomainEthereum.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: EthereumContract
  })(secret) as ICurrency & IContract;

export class EthereumContract extends EthereumBasedCurrency implements IContract {
  private web3: Web3;

  constructor(
    privateKey: string,
    currency: DomainEthereum | DomainEthereumClassic,
    private rpcEndpoint?: string
  ) {
    super(privateKey, currency);
    this.web3 = this.getProvider(rpcEndpoint);
  }

  getInstance(abi: AbiItem[], contractAddress: string): Contract {
    return new this.web3.eth.Contract(abi, contractAddress);
  }

  getCallData(params: ContractCall): any {
    if (!params.contractInstance.methods[params.methodName]) {
      throw new Error(`Method ${params.methodName} does not exist`);
    }
    const executionParameters = !params.executionParameters ? [] : params.executionParameters;
    return params.contractInstance.methods[params.methodName](...executionParameters).encodeABI();
  }

  estimateGasRawData(params: TxConfig): Promise<number> {
    const txConfig: TransactionConfig = {
      to: params.to,
      data: params.data,
      from: !params.from ? '0x0000000000000000000000000000000000000000' : params.from,
      gas: !params.gas ? '0x6ACFC0' : DecimalToHex(params.gas), // 7_000_000
      gasPrice: !params.gasPrice ? '0xB2D05E00' : DecimalToHex(params.gasPrice), // 3_000_000_000
      value: !params.value ? '0' : DecimalToHex(params.value)
    };
    return Promise.resolve(this.web3.eth.estimateGas(txConfig));
  }

  callMethod(params: ContractCall): Promise<any> {
    const executionParameters = !params.executionParameters ? [] : params.executionParameters;
    return Promise.resolve(
      params.contractInstance.methods[params.methodName](...executionParameters).call({
        from: this.getAddress()
      })
    );
  }

  private getProvider(rpcEndpoint: string | undefined): Web3 {
    if (rpcEndpoint) {
      return new Web3(rpcEndpoint);
    }

    switch (this.currency.short) {
      case 'etc':
        return new Web3('https://ethereumclassic.network');
      case 'poa':
        return new Web3('http://54.144.107.14:8545');
      default:
        return new Web3('https://mainnet.infura.io/1u84gV2YFYHHTTnh8uVl');
    }
  }

  awaitTx(txnHash: Array<string> | string): Promise<any> | Promise<any[]> {
    if (Array.isArray(txnHash)) {
      const promises: any = [];
      txnHash.forEach(oneTxHash => {
        promises.push(this.awaitTx(oneTxHash));
      });
      return Promise.all(promises);
    } else {
      return new Promise(async (resolve, reject) => {
        await this.transactionReceiptAsync(txnHash, resolve, reject);
      });
    }
  }

  // todo: rewrite
  private async transactionReceiptAsync(txnHash: string, resolve: any, reject: any): Promise<void> {
    const interval = 2000;
    const blocksToWait = 1;

    console.log('wait for tx first confirmation');
    try {
      const receipt = this.web3.eth.getTransactionReceipt(txnHash);
      if (!receipt) {
        setTimeout(async () => {
          await this.transactionReceiptAsync(txnHash, resolve, reject);
        }, interval);
      } else {
        if (blocksToWait > 0) {
          const resolvedReceipt = await receipt;
          if (!resolvedReceipt || !resolvedReceipt.blockNumber) {
            setTimeout(async () => {
              await this.transactionReceiptAsync(txnHash, resolve, reject);
            }, interval);
          } else {
            try {
              const block = await this.web3.eth.getBlock(resolvedReceipt.blockNumber);
              const current = await this.web3.eth.getBlock('latest');
              if (current.number - block.number >= blocksToWait) {
                const txn = await this.web3.eth.getTransaction(txnHash);
                if (txn.blockNumber) {
                  resolve(resolvedReceipt);
                } else {
                  reject(
                    new Error('Transaction with hash: ' + txnHash + ' ended up in an uncle block.')
                  );
                }
              } else {
                setTimeout(async () => {
                  await this.transactionReceiptAsync(txnHash, resolve, reject);
                }, interval);
              }
            } catch (e) {
              setTimeout(async () => {
                await this.transactionReceiptAsync(txnHash, resolve, reject);
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
}
