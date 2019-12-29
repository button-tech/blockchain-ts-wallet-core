import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcoinCashRoutingModule } from './bitcoinCash-routing.module';
import { SendModule } from 'projects/app/src/app/send/send.module';
import { BlockchainUtilsService } from '../../blockchainUtils.service';
import { UtxoBasedUtils } from '../utxoBased.utils';
import { SharedModule } from '../../shared.module';
import { BitcoinCash } from '../../DomainCurrency';


export function factory(utils: BlockchainUtilsService) {
  return new UtxoBasedUtils(utils, BitcoinCash.Instance());
}

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SendModule.forChild({
        someId: '58de0d382810697275ee66e176c4d8a0bd2a397d93fa2560ec4d89db3ba5a353',
        factory
      },
    ),
    CommonModule,
    BitcoinCashRoutingModule
  ]
})
export class BitcoinCashModule {
}
