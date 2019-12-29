import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumRoutingModule } from './ethereum-routing.module';
import { SendModule } from '../../../send/send.module';
import { BlockchainUtilsService } from '../../blockchainUtils.service';
import { SharedModule } from '../../shared.module';
import { Ethereum } from '../../DomainCurrency';
import { EthereumUtils } from '../ethereum.utils';


export function factory(utils: BlockchainUtilsService) {
  return new EthereumUtils(utils, Ethereum.Instance());
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
    EthereumRoutingModule
  ]
})
export class EthereumModule {
}
