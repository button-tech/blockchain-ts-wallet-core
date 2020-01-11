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
import { ActivatedRoute } from '@angular/router';
import { BigNumber } from 'bignumber.js';
import { QRCode } from 'jsqr';
import { QrcodeComponent } from './components/qrcode/qrcode.component';

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

  signTransaction$(params: SignTransactionParams, guid?: string): Observable<string | ITransferTransaction | Transaction>;

  sendTransaction$(rawTransaction: string | ITransferTransaction | Transaction, guid: string): Observable<string>;
}

export interface IContractService extends IBlockchainService {
  awaitTx$?(txnHash: Array<string> | string): Promise<any> | Promise<any[]>;

  getInstance?(abi: AbiItem[], contractAddress: string): Contract;

  callMethod$?(params: ContractCall): Observable<any>;

  setValue$?(params: ContractCall, guid: string, isSync?: boolean): Observable<string>;

  estimateGasRawData$?(params: TxConfig): Observable<number>;

  decimalToHex?(d: number | string): string;
}

export function TryParse<T>(text: string): [boolean, T] {
  try {
    return [true, JSON.parse(text) as T];
  } catch (e) {
    return [false, null];
  }
}

export function IsJson(text: string): boolean {
  return /^[\],:{}\s]*$/.test(
    text.replace(
      /\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
}

export function GetGuid(route: ActivatedRoute, param: string) {
  return route.snapshot.queryParamMap.get(param);
}

export const Tbn = (x: string | number): BigNumber => new BigNumber(x);

export function FromDecimal(x: string | number | BigNumber, n: number): BigNumber {
  return BigNumber.isBigNumber(x) ? x.times(10 ** n).integerValue() : Tbn(x).times(10 ** n).integerValue();
}

export function ToDecimal(x: string | number | BigNumber, n: number): BigNumber {
  return BigNumber.isBigNumber(x) ? x.div(10 ** n) : Tbn(x).div(10 ** n);
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
