import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {StorageService} from '../../shared/services/storage/storage.service';
import {Security} from '../../shared/services/security/security.service';
import {
  CurrencyFactoryOptions,
  IBlockchainService,
  ICurrencyFactory,
  PrivateKeys,
  QrCodeData
} from '../../shared/shared.module';
import {Options, QrCode} from '../../shared/components/qrcode/qrcode.service';
import {NodeApiProvider} from '../../shared/providers/node-api.provider';

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

  importFormControl  = new FormGroup({
    mnemonic: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    password_second: new FormControl('', Validators.required)
  });
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
    // todo: check mnemonic
    const s = new StorageService();
    const cypher = Security.encryptSecret(this.mnemonic, this.password);
    s.cypherParams = { salt: cypher.salt, iv: cypher.iv };
    s.storage = { secret: cypher.text, expired: false };
    const qrData: QrCodeData = {
      mnemonic: cypher.text,
      iv: cypher.iv,
      salt: cypher.salt
    };
    const opt: Options = { text: JSON.stringify(qrData) };
    const qr = new QrCode();
    qr.render(opt, this.qrcode);
    this.display = false;
  }

  importByQR(qrRawData: string) {
    if (this.password_second === '') {
      console.log('empty password'); return;
    }
    const decryptedText = this.decryptQrCodeData(qrRawData);
    if (decryptedText instanceof Error) {
      // todo: handle error: from decryption + if the error was thrown
      console.log(decryptedText); return;
    }
    console.log(decryptedText);
  }


  private decryptMnemonicVersion(qrRawData: string): string | Error {
    const qrData = JSON.parse(qrRawData);
    if (!((qrData as QrCodeData).mnemonic)) {
      return new Error('qr code doesn\'t contain secret keys');
    }
    try {
      return Security.decryptSecret(qrData.mnemonic, this.password, qrData.salt, qrData.iv);
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }

  private decryptQrCodeData(qrRawData: string): string | PrivateKeys | Error {
    if (this.isJson(qrRawData)) {
      return this.decryptMnemonicVersion(qrRawData);
    }
    return this.decryptPrivateKeysVersion(qrRawData);
  }

  private isJson(text: string): boolean {
    return /^[\],:{}\s]*$/.test(
      text.replace(
        /\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  }

  private decryptPrivateKeysVersion(qrRawData: string): PrivateKeys | Error {
    try {
      const privateKeysJson = Security.decryptSecret(qrRawData.toString(), this.password);
      if (!this.isJson(privateKeysJson)) {
        return new Error('qr code doesn\'t contain secret keys');
      }
      const privateKeys = JSON.parse(privateKeysJson);
      if ((privateKeys as PrivateKeys).ethereum) {
        return new Error('qr code doesn\'t contain secret keys');
      }
      return privateKeys;
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }
}
