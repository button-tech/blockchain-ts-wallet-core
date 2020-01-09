import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NodeApiProvider } from '../shared/providers/node-api.provider';
import { BotBackendProvider } from '../shared/providers/bot-backend.provider';
import { StorageService, Storage, CypherParams } from '../shared/services/storage/storage.service';
import {
  CurrencyFactoryOptions,
  IBlockchainService,
  ICurrencyFactory,
  PrivateKeys,
  QrCodeData
} from '../shared/shared.module';
import { Security } from '../shared/services/security/security.service';

type SendingMode = 'fast' | 'qrcode';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SendComponent implements OnInit {

  password = '';
  amount = 0;
  toAddress = '';

  private bcs: IBlockchainService;

  private storage: Storage;
  private cypherParams: CypherParams;

  constructor(@Inject('SuperService') private currencyFactory: ICurrencyFactory,
              private utils: NodeApiProvider,
              private botApi: BotBackendProvider,
              private s: StorageService) {
    this.storage = s.storage;
    this.cypherParams = s.cypherParams;
  }

  ngOnInit() {
    const sendingMode = this.getSendingMode();
    if (sendingMode === 'fast') {

    } else if (sendingMode === 'qrcode') {
      // render upload qr code template
    }
  }

  receiveQrCodeData(qrRawData: string) {
    if (this.password === '') {
      // todo: handle user doesn't entered password
      return;
    }
    const decryptedText = this.decryptQrCodeData(qrRawData);
    if (decryptedText instanceof Error) {
      // todo: handle error: from decryption + if the error was thrown
      return;
    }
    console.log(decryptedText);
    // todo: get derivationPath from backend
    const opt: CurrencyFactoryOptions = { secret: decryptedText, password: '', derivationPath: 0 };
    this.bcs = this.currencyFactory.init(this.utils, opt);
  }

  private decryptQrCodeData(qrRawData: string): string | PrivateKeys | Error {
    if (this.isJson(qrRawData)) {
      const qrData = JSON.parse(qrRawData);
      if (!((qrData as QrCodeData).mnemonic)) {
        return new Error('qr code doesn\'t contain secret keys');
      }
      return Security.decryptSecret(qrData.mnemonic, this.password, qrData.salt, qrData.iv);
    }

    const privateKeysJson = Security.decryptSecret(qrRawData.toString(), this.password);
    if (!this.isJson(privateKeysJson)) {
      return new Error('qr code doesn\'t contain secret keys');
    }
    const privateKeys = JSON.parse(privateKeysJson);
    if ((privateKeys as PrivateKeys).ethereum) {
      return new Error('qr code doesn\'t contain secret keys');
    }
    return privateKeys;
  }

  private getSendingMode(): SendingMode {
    if (this.storage.secret) {
      return 'fast';
    }
    return 'qrcode';
  }

  private isJson(text: string): boolean {
    return /^[\],:{}\s]*$/.test(
      text.replace(
        /\\["\\\/bfnrtu]/g, '@')
        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
  }
}
