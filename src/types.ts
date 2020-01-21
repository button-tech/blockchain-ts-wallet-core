// Ethereum
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { IDomainCurrency } from './DomainCurrency';

export const EthereumDecimals = 18;
export const StellarDecimals = 7;
export const UtxoDecimals = 8;
export const WavesDecimals = 8;

export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export interface Keys {
  privateKey: string;
  publicKey: string;
  address: string;
}

export const hdPath = {
  bitcoin: "m/44'/0'/0'/0",
  litecoin: "m/44'/2'/0'/0",
  ripple: "m/44'/144'/0'/0",
  bitcoinCash: "m/44'/145'/0'/0",

  // ETH forks
  ethereum: "m/44'/60'/0'/0",
  ethereumClassic: "m/44'/61'/0'/0",
  poa: "m/44'/178'/0'/0",
  tron: "m/44'/195'/0'/0",

  waves: "m/44'/5741564'/0'/0'/",
  stellar: "m/44'/148'/",
  ton: "m/44'/396'/"
};

export class MnemonicDescriptor {
  constructor(public phrase: string, public index: number, public password: string = '') {}
}

interface CurrencyFactory {
  currency: IDomainCurrency;
  getKeyPair: (currency: IDomainCurrency, secret: MnemonicDescriptor) => KeyPair;
  instance: new (privateKey: string, currency: IDomainCurrency) => ICurrency;
}

export function currencyFactory(factory: CurrencyFactory) {
  return function(secret: string | MnemonicDescriptor): ICurrency {
    if (secret instanceof MnemonicDescriptor) {
      const keyPair = factory.getKeyPair(factory.currency, secret);
      return new factory.instance(keyPair.privateKey, factory.currency);
    }
    return new factory.instance(secret, factory.currency);
  };
}

export interface ICurrency {
  getAddress(): string;

  signTransaction(params: TransactionParams): Promise<string>;
}

export interface IContract extends ICurrency {
  getInstance(abi: AbiItem[], contractAddress: string): Contract;

  getCallData(params: ContractCall): any;

  callMethod(params: ContractCall): Promise<any>;

  estimateGasRawData?(params: TxConfig): Promise<number>;

  awaitTx(txnHash: Array<string> | string): Promise<any> | Promise<any[]>;
}

export type TransactionParams =
  | EthereumTransactionParams
  | UtxoTransactionParams
  | WavesTransactionParams
  | StellarTransactionParams;

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
