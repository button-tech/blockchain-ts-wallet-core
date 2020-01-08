import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StellarRoutingModule} from './stellar-routing.module';
import {StellarComponent} from './stellar.component';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from "../../../providers/node-api.provider";
import {StellarUtils} from "./stellar.utils";

console.log('hi xlm');

export function factory(utils: NodeApiProvider) {
  return new StellarUtils(utils);
}

@NgModule({
  declarations: [StellarComponent],
  imports: [
    SendModule.forChild({
      someId: 'SB2QXEAQ7L3YAHRBEF3VGVFDJZOMBP2QBDUTG6A3JVD4IXBZP7MZI7TT',
      factory
    }),
    CommonModule,
    StellarRoutingModule,
  ],
  providers: []
})
export class StellarModule {
}
