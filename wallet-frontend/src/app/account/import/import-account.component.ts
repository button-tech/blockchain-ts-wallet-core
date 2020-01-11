import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { StorageService } from '../../shared/services/storage/storage.service';
import { Security } from '../../shared/services/security/security.service';
import { GetGuid, QrCodeData } from '../../shared/shared.module';
import { Options, QrCode } from '../../shared/components/qrcode/qrcode.service';
import { NodeApiProvider } from '../../shared/providers/node-api.provider';
import { Decryption } from '../../shared/services/send/send.service';
import { AccountService } from '../../shared/services/account/account.service';
import { CreateAccountRequest } from '../../shared/dto/bot-backend.dto';
import { BotBackendProvider } from '../../shared/providers/bot-backend.provider';
import { ActivatedRoute } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-new-account',
  templateUrl: './import-account.component.html',
  styles: [],
})
export class ImportAccountComponent {
  display = true;
  href: string;
  utils: NodeApiProvider;

  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;

  importFormControl = new FormGroup({
    mnemonic: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password_second: new FormControl('', Validators.required)
  });

  constructor(private storageService: StorageService,
              private decryption: Decryption,
              private botApi: BotBackendProvider,
              private router: ActivatedRoute) {
  }

  downloadImage() {
    this.href = document.getElementsByTagName('img')[0].src;
  }

  get mnemonic() {
    return this.importFormControl.value.mnemonic;
  }

  get password() {
    return this.importFormControl.value.password;
  }

  get password_second() {
    return this.importFormControl.value.password_second;
  }

  importByMnemonic() {
    const guid = GetGuid(this.router, 'create');

    // todo: check mnemonic
    const cipher = Security.encryptSecret(this.mnemonic, this.password);
    AccountService.generateQrCode(this.qrcode, cipher);
    AccountService.saveAccount(this.mnemonic);

    const addresses = AccountService.generateKeyPairs(this.mnemonic, this.password);

    const req: CreateAccountRequest = {
      bitcoinAddress: addresses.Bitcoin,
      bitcoinCashAddress: addresses.BitcoinCash,
      litecoinAddress: addresses.Litecoin,
      ethereumAddress: addresses.Ethereum,
      ethereumClassicAddress: addresses.EthereumClassic,
      wavesAddress: addresses.Waves,
      stellarAddress: addresses.Stellar
    };
    // this.botApi.registerAccount$(req, guid).subscribe();
    this.display = false;
  }

  importByQR(qrRawData: string) {
    if (this.password_second === '') {
      console.log('empty password');
      return;
    }
    const decryptedText = this.decryption.decryptQrCodeData(qrRawData, this.password_second);
    if (decryptedText instanceof Error) {
      // todo: handle error: from decryption + if the error was thrown
      console.log(decryptedText);
      return;
    }
    console.log(decryptedText);

    AccountService.saveAccount(decryptedText);
  }

}
