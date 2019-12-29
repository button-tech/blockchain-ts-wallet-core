import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendRoutingModule } from './send-routing.module';
import { SendComponent } from './send.component';
import { SendService } from 'projects/app/src/app/send/send.service';
import { Observable } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { BlockchainUtilsService } from '../shared/blockchainUtils.service';
import { SharedModule } from '../shared/shared.module';


// Waves
import { ITransferTransaction } from 'waves-transactions/transactions';

// Stellar
import { Transaction } from 'stellar-sdk';

// Ethereum
import { TxConfig } from '../shared/currencies/ethereumContract.utils';
import { Contract } from 'web3-eth-contract';
import { AbiItem } from 'web3-utils';


// TODO: make IBlockchainService.signTransaction$ template method, and move classes interfaces to shared

export interface ISomeInterface {
  someId: string;
  factory: (utils: BlockchainUtilsService) => IBlockchainService;
}

export interface SignTransactionParams {
  privateKey: string;
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
  declarations: [SendComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    SendRoutingModule
  ]
})
export class SendModule {

  static forChild(config: any) {
    return {
      ngModule: SendModule,
      providers: [
        SendService,
        {
          provide: 'SuperService',
          useValue: config
        }
      ]
    };
  }
}
