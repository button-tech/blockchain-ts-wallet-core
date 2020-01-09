import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import { HdWallet } from '../../shared/services/hd-wallet/hd-wallet.service';
import {StorageService} from '../../shared/services/storage/storage.service';
import {Security} from '../../shared/services/security/security.service';
import {QrCodeData} from '../../shared/shared.module';
import {Options, QrCode} from "../../shared/components/qrcode/qrcode.service";

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
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  importFormControl  = new FormGroup({
    mnemonic: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
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

  importByQR() {
  }
}
