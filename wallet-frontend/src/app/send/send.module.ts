import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SendRoutingModule } from './send-routing.module';
import { SendComponent } from './send.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../shared/services/storage/storage.service';
import { Decryption } from '../shared/services/send/send.service';
import { UploadQrcodeModule } from '../shared/components/qrcode/uploadQrcode/uploadQrcode.module';

@NgModule({
  declarations: [
    SendComponent,
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    SharedModule,
    SendRoutingModule,
    FormsModule,
    UploadQrcodeModule
  ],
  providers: [
    StorageService,
    Decryption
  ],
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
