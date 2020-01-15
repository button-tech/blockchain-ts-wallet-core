import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {HdWalletRoutingModule} from './hd-wallet-routing.module';
import {HdWalletComponent} from './hd-wallet.component';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';
import {NodeApiProvider} from '../shared/providers/node-api.provider';
import { RenderQrcodeModule } from '../shared/components/qrcode/renderQrcode/renderQrcode.module';

@NgModule({
  declarations: [HdWalletComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    HdWalletRoutingModule,
    FormsModule,
    RenderQrcodeModule
  ],
  providers: [
    NodeApiProvider
  ]
})
export class HdWalletModule {

}
