import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendRoutingModule } from './send-routing.module';
import { SendComponent } from './send.component';
import { SendService } from './send.service';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { QrcodeComponent } from '../shared/components/qrcode/qrcode.component';

@NgModule({
  declarations: [SendComponent, QrcodeComponent],
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
