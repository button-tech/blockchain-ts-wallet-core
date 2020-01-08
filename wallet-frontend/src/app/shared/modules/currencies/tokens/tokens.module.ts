import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensRoutingModule } from './tokens-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { SharedModule } from '../../../shared.module';
import { Ethereum } from '../../../DomainCurrency';
import { EthereumContractUtils } from '../ethereumContract.utils';


export function factory(utils: NodeApiProvider) {
  return new EthereumContractUtils(utils, Ethereum.Instance());
}

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SendModule.forChild({
        someId: 'current robot business master inner detect easy west diary smile creek coast fiber address gold',
        factory
      },
    ),
    CommonModule,
    TokensRoutingModule
  ]
})
export class TokensModule {
}
