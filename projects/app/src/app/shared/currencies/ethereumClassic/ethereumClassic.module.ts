import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumClassicRoutingModule } from './ethereumClassic-routing.module';
import { SendModule } from 'projects/app/src/app/send/send.module';
import { BlockchainUtilsService } from '../../blockchainUtils.service';
import { SharedModule } from '../../shared.module';
import { EthereumClassic } from '../../DomainCurrency';
import { EthereumUtils } from '../ethereum.utils';


export function factory(utils: BlockchainUtilsService) {
  return new EthereumUtils(utils, EthereumClassic.Instance());
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
    EthereumClassicRoutingModule
  ]
})
export class EthereumClassicModule {
}
