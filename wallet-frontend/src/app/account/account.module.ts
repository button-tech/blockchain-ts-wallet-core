import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountRoutingModule } from './account-routing.module';
import { NewAccountComponent } from './new/new-account.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportAccountComponent } from './import/import-account.component';
import { HttpClientModule } from '@angular/common/http';
import { QrcodeComponent } from '../shared/components/qrcode/qrcode.component';
import { BotBackendProvider } from '../shared/providers/bot-backend.provider';
import { Decryption } from '../shared/services/send/send.service';
import { AccountService } from '../shared/services/account/account.service';
import { StorageService } from '../shared/services/storage/storage.service';


@NgModule({
  declarations: [
    NewAccountComponent,
    ImportAccountComponent,
    QrcodeComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    AccountRoutingModule,
    MatCardModule,
    MatCheckboxModule
  ],
  providers: [
    BotBackendProvider,
    Decryption,
    AccountService,
    StorageService
  ]
})
export class AccountModule {
}
