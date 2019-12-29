import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WavesRoutingModule} from './waves-routing.module';
import {SendModule} from '../../../send/send.module';
import {BlockchainUtilsService} from '../../blockchainUtils.service';
import {WavesUtils} from './waves.utils';
import {SharedModule} from '../../shared.module';


export function factory(utils: BlockchainUtilsService) {
  return new WavesUtils(utils);
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
    WavesRoutingModule
  ]
})
export class WavesModule {
}
