import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { HdWallet } from '../../shared/services/hd-wallet/hd-wallet.service';
import { StorageService } from '../../shared/services/storage/storage.service';
import { Security } from '../../shared/services/security/security.service';
import { Options, QrCode } from '../../shared/components/qrcode/qrcode.service';
import { environment } from '../../../environments/environment';
import { QrCodeData } from '../../shared/shared.module';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface IRow {
  label: string;
  address: string;
  privateKey: string;
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styles: [
      `
      .example-form {
        min-width: 150px;
        max-width: 500px;
        width: 100%;
      }

      .example-full-width {
        width: 100%;
      }

      .example-form > * {
        margin-bottom: 10px;
      }

      .example-button-row button,
      .example-button-row a {
        margin-right: 8px;
      }
    `
  ],
})


export class NewAccountComponent {
  constructor(private http: HttpClient) {
  }

  data: Array<IRow> = [];
  words: string;
  password = '';
  checked = false;
  display = true;
  href: string;
  formData: FormData;
  @ViewChild('qrcode', { static: false }) qrcode: ElementRef;
  color = 'accent';

  newAccountForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    termOfService: new FormControl('', Validators.required),
    privacyPolicy: new FormControl('', Validators.required),
    sendQr: new FormControl(true),
  });

  matcher = new MyErrorStateMatcher();

  get email() {
    return this.newAccountForm.get('email');
  }

  generateMnemonic() {
    const newMnemonic = HdWallet.generateMnemonic();

    const s = new StorageService();

    document.querySelector('div#qrcode').innerHTML = '';

    const cypher = Security.encryptSecret(newMnemonic, this.password);
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

    this.words = newMnemonic;
    const mnemonic = Security.decryptSecret(cypher.text, this.password, cypher.salt, cypher.iv);
    console.log(mnemonic);
  }

  generateKeyPairs() {
    const hdWallet = new HdWallet(this.words, this.password);
    const { btc, ltc, eth, bch, etc, waves, xlm } = hdWallet.generateAllKeyPairs(0);
    this.data = [
      { label: 'BTC', address: btc.address, privateKey: btc.privateKey },
      { label: 'LTC', address: ltc.address, privateKey: ltc.privateKey },
      { label: 'BCH', address: bch.address, privateKey: bch.privateKey },
      { label: 'ETH', address: eth.address, privateKey: eth.privateKey },
      { label: 'ETC', address: etc.address, privateKey: etc.privateKey },
      { label: 'XLM', address: xlm.address, privateKey: xlm.privateKey },
      { label: 'Waves', address: waves.address, privateKey: waves.privateKey },
    ];
  }

  downloadImage() {
    this.href = document.getElementsByTagName('img')[0].src;
  }

  createNewAccount() {
    this.generateMnemonic();
    this.generateKeyPairs();
    console.log(this.checked);
    this.display = false;
    if (this.checked) {
      const body = {
        src: this.href
      };
      this.http.post(environment.backendUrl, body);
    }
  }
}
