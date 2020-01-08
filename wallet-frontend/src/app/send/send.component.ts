import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NodeApiProvider } from '../shared/providers/node-api.provider';
import { BotBackendProvider } from '../shared/providers/bot-backend.provider';
import { StorageService, Storage, CypherParams } from '../shared/services/storage/storage.service';
import { IBlockchainService, ICurrencyFactory, OldQrCodeData, QrCodeData } from '../shared/shared.module';
import { Security } from '../shared/services/security/security.service';

type SendingMode = 'fast' | 'qrcode';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SendComponent implements OnInit {

  bcs: IBlockchainService;

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

  private getSendingMode(): SendingMode {
    if (this.storage.secret) {
      return 'fast';
    }
    return 'qrcode';
  }

  receiveQrCodeData($event) {
    const qrData: QrCodeData | OldQrCodeData = JSON.parse($event);
    // const decryptedText = Security.decryptSecret();
    if ((qrData as QrCodeData).mnemonic) {
      this.storage.secret = (qrData as QrCodeData).mnemonic;
      this.cypherParams.iv = (qrData as QrCodeData).iv;
      this.cypherParams.salt = (qrData as QrCodeData).salt;
    } else if ((qrData as OldQrCodeData).privateKeys) {
      this.storage.secret = (qrData as OldQrCodeData).privateKeys;
    }
  }


}
