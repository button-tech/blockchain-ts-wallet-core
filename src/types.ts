// Ethereum
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';

export const EthereumDecimals = 18;
export const StellarDecimals = 7;
export const UtxoDecimals = 8;
export const WavesDecimals = 8;

export class MnemonicDescriptor {
  constructor(public phrase: string, public index: number, public password: string = '') {}
}

export interface ICurrency {
  getAddress(): string;

  signTransaction(
    params:
      | EthereumTransactionParams
      | UtxoTransactionParams
      | WavesTransactionParams
      | StellarTransactionParams
  ): Promise<string>;
}

export interface IContract extends ICurrency {
  getInstance(abi: AbiItem[], contractAddress: string): Contract;

  getCallData(params: ContractCall): any;

  callMethod(params: ContractCall): Promise<any>;

  estimateGasRawData?(params: TxConfig): Promise<number>;

  awaitTx(txnHash: Array<string> | string): Promise<any> | Promise<any[]>;
}

export interface EthereumTransactionParams {
  toAddress: string;
  amount: string;
  nonce: number;
  gasLimit: number;
  gasPrice: number;
  data?: string;
}

export interface UtxoTransactionParams {
  toAddress: string;
  amount: string;
  inputs: Array<UTXO>;
  fee: number;
}

export interface StellarTransactionParams {
  toAddress: string;
  amount: string;
  memo?: string;
}

export interface WavesTransactionParams {
  toAddress: string;
  amount: string;
  timestamp?: number;
}

export interface TxConfig {
  to: string;
  data: string;
  from?: string;
  gas?: number;
  value?: string;
  gasPrice?: string;
}

export interface ContractCall {
  contractInstance: Contract;
  methodName: string;
  contractAddress: string;
  addressFrom?: string;
  privateKey?: string;
  executionParameters?: Array<any>;
  nonce?: number;
  gasLimit?: number;
  gasPrice?: number;
  amount?: string;
}

export interface UTXO {
  address: string;
  txid: string;
  vout: number;
  scriptPubKey: string;
  amount: string;
  satoshis: number;
  height: number;
  confirmations: number;
  legacyAddress?: string;
  cashAddress?: string;
}

export interface TxConfig {
  to: string;
  data: string;
  from?: string;
  gas?: number;
  value?: string;
  gasPrice?: string;
}
