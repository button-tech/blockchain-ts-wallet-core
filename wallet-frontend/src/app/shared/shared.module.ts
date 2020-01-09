import { NgModule } from '@angular/core';
import { NodeApiProvider } from './providers/node-api.provider';
import { BotBackendProvider } from './providers/bot-backend.provider';


// Waves
import { ITransferTransaction } from 'waves-transactions/transactions';

// Stellar
import { Transaction } from 'stellar-sdk';

// Ethereum
import { TxConfig } from './modules/currencies/ethereumContract.utils';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { Observable } from 'rxjs';

// TODO: make IBlockchainService.signTransaction$ template method, and move classes interfaces to shared

export interface QrCodeData {
  mnemonic: string;
  iv: string;
  salt: string;
}

export interface ICurrencyFactory {
  init: (utils: NodeApiProvider, opt: CurrencyFactoryOptions) => IBlockchainService;
}

export interface CurrencyFactoryOptions {
  secret: string | PrivateKeys;
  password: string;
  derivationPath: number;
}

export interface PrivateKeys {
  waves: string;
  ethereum: string;
  bitcoin: string;
  bitcoinCash: string;
  litecoin: string;
  ethereumClassic: string;
  stellar: string;
}

export interface SignTransactionParams {
  toAddress: string;
  amount: string;
  nonce?: number;
  gasLimit?: number;
  gasPrice?: number;
  data?: string;
  memo?: string;
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

export interface IBlockchainService {
  getAddress(privateKey: string): string;

  getBalance$(address: string, guid: string): Observable<number>;

  signTransaction$(params: SignTransactionParams, guid?: string): Promise<string | ITransferTransaction | Transaction>;

  sendTransaction$(rawTransaction: string, guid: string): Observable<string>;
}

export interface IContractService extends IBlockchainService {
  awaitTx$?(txnHash: Array<string> | string): Promise<any> | Promise<any[]>;
  getInstance?(abi: AbiItem[], contractAddress: string): Contract;
  callMethod$?(params: ContractCall): Observable<any>;
  setValue$?(params: ContractCall, guid: string, isSync?: boolean): Promise<string>;
  estimateGasRawData$?(params: TxConfig): Promise<number>;
  decimalToHex?(d: number | string): string;
}


@NgModule({
  declarations: [
    // BlockchainUtilsService
  ],
  imports: [],
  providers: [
    NodeApiProvider,
    BotBackendProvider
  ]
})
export class SharedModule {
  // For
}
