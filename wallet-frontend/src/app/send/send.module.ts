import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendRoutingModule } from './send-routing.module';
import { SendComponent } from './send.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { QrcodeComponent } from '../shared/components/qrcode/qrcode.component';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../shared/services/storage/storage.service';
import { Decryption } from '../shared/services/send/send.service';

@NgModule({
  declarations: [SendComponent, QrcodeComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    SendRoutingModule,
    FormsModule
  ],
  providers: [
    StorageService,
    Decryption
  ]
})
export class SendModule {

  static forChild(config: any) {
    return {
      ngModule: SendModule,
      providers: [
        {
          provide: 'SuperService',
          useValue: config
        }
      ]
    };
  }


}
