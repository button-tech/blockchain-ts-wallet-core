import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WavesRoutingModule} from './waves-routing.module';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from '../../../providers/node-api.provider';
import {WavesUtils} from './waves.utils';
import {SharedModule} from '../../../shared.module';


export function factory(utils: NodeApiProvider) {
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
