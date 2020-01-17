import { NgModule } from '@angular/core';
import { NodeApiProvider } from './providers/node-api.provider';
import { BotBackendProvider } from './providers/bot-backend.provider';


// Waves
import { ITransferTransaction } from 'waves-transactions/transactions';

// Stellar
import { Transaction } from 'stellar-sdk';

// Ethereum
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import {
  ContractCall,
  EthereumTransactionParams, StellarTransactionParams,
  TxConfig,
  UtxoTransactionParams,
  WavesTransactionParams
} from '../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto';

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

export interface Addresses {
  Waves: string;
  Ethereum: string;
  Bitcoin: string;
  BitcoinCash: string;
  Litecoin: string;
  EthereumClassic: string;
  Stellar: string;
}

export interface PrivateKeys {
  Waves: string;
  Ethereum: string;
  Bitcoin: string;
  BitcoinCash: string;
  Litecoin: string;
  EthereumClassic: string;
  Stellar: string;
}

export type SignTransactionParams = WavesTransactionParams | EthereumTransactionParams | UtxoTransactionParams | StellarTransactionParams;

export interface IBlockchainService {
  getAddress(privateKey: string): string | Observable<string>;

  getBalance$(address: string, guid: string): Observable<number>;

  signTransaction$(params: SignTransactionParams, guid?: string): Observable<string | ITransferTransaction | Transaction>;

  sendTransaction$(rawTransaction: string | ITransferTransaction | Transaction, guid: string): Observable<string>;
}

export interface IContractService extends IBlockchainService {
  awaitTx$?(txnHash: Array<string> | string): Promise<any> | Promise<any[]>;

  getInstance?(abi: AbiItem[], contractAddress: string): Contract;

  callMethod$?(params: ContractCall): Observable<any>;

  setValue$?(params: ContractCall, guid: string, isSync?: boolean): Observable<string>;

  estimateGasRawData$?(params: TxConfig): Observable<number>;
}

export function TryParse<T>(text: string): [boolean, T] {
  try {
    return [true, JSON.parse(text) as T];
  } catch (e) {
    return [false, null];
  }
}

export function IsJson(text: string): boolean {
  try {
    const x = JSON.parse(text);
    return !!x;
  } catch (e) {
    return false;
  }
}

export function GetGuid(route: ActivatedRoute, param: string) {
  return route.snapshot.queryParamMap.get(param);
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
