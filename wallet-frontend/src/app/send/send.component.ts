import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NodeApiProvider } from '../shared/providers/node-api.provider';
import { BotBackendProvider } from '../shared/providers/bot-backend.provider';
import { StorageService, Storage, CypherParams } from '../shared/services/storage/storage.service';
import {
  CurrencyFactoryOptions, GetGuid,
  IBlockchainService,
  ICurrencyFactory, IsJson,
  PrivateKeys,
  QrCodeData, SignTransactionParams, TryParse
} from '../shared/shared.module';
import { Security } from '../shared/services/security/security.service';
import { TransactionResponse } from '../shared/dto/bot-backend.dto';
import { ActivatedRoute } from '@angular/router';
import { catchError, delay, map, retry, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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
  hash = '';

  guid: string;
  transactionData: TransactionResponse;

  private bcs: IBlockchainService;

  private storage: Storage;
  private cypherParams: CypherParams;

  constructor(@Inject('SuperService') private currencyFactory: ICurrencyFactory,
              private utils: NodeApiProvider,
              private botApi: BotBackendProvider,
              private s: StorageService,
              private route: ActivatedRoute) {
    this.storage = s.storage;
    this.cypherParams = s.cypherParams;
  }

  ngOnInit() {
    this.guid = GetGuid(this.route, 'tx');

    this.botApi.getTransactionData$(this.guid).pipe(
      tap((txData: TransactionResponse) => {
        this.transactionData = txData;
        const sendingMode = this.getSendingMode();
        if (sendingMode === 'fast') {

        } else if (sendingMode === 'qrcode') {
          // render upload qr code template
        }
      }),
      catchError((e) => {
        console.log('Find error: ', e);
        return of(e);
      })
    ).subscribe((res) => {
      if (!(res instanceof Error)) {
        console.log('Result: ', res);
      }
    });
  }

  async receiveQrCodeData(qrRawData: string) {
    if (this.password === '') {
      // todo: handle user doesn't entered password
      console.log('empty password');
      return;
    }
    const decryptedText = this.decryptQrCodeData(qrRawData);
    if (decryptedText instanceof Error) {
      // todo: handle error: from decryption + if the error was thrown
      console.log(decryptedText);
      return;
    }
    console.log(decryptedText);
    // todo: get derivationPath from backend
    const opt: CurrencyFactoryOptions = { secret: decryptedText, password: '', derivationPath: 0 };
    this.bcs = this.currencyFactory.init(this.utils, opt);
    const transactionParams: SignTransactionParams = {
      toAddress: this.transactionData.to,
      amount: this.transactionData.value
    };
    const signedTx = await this.bcs.signTransaction$(transactionParams, this.guid).toPromise();
    this.hash = await this.bcs.sendTransaction$(signedTx, this.guid).toPromise();
    this.botApi.sendTransactionData$(this.hash, this.guid).subscribe();
  }

  private decryptQrCodeData(qrRawData: string): string | PrivateKeys | Error {
    if (IsJson(qrRawData)) {
      return this.decryptMnemonicVersion(qrRawData);
    }
    return this.decryptPrivateKeysVersion(qrRawData);
  }

  private decryptMnemonicVersion(qrRawData: string): string | Error {
    const [ok, qrData] = TryParse<QrCodeData>(qrRawData);
    if (!ok || !qrData.mnemonic) {
      return Error('qr code doesn\'t contain secret keys');
    }
    try {
      return Security.decryptSecret(qrData.mnemonic, this.password, qrData.salt, qrData.iv);
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }

  private decryptPrivateKeysVersion(qrRawData: string): PrivateKeys | Error {
    try {
      const privateKeysJson = Security.decryptSecret(qrRawData.toString(), this.password);
      const [ok, privateKeys] = TryParse<PrivateKeys>(privateKeysJson);
      if (!ok || !privateKeys.Ethereum) {
        return Error('qr code doesn\'t contain secret keys');
      }
      return privateKeys;
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }

  private getSendingMode(): string {
    if (this.storage.secret) {
      return 'fast';
    }
    return 'qrcode';
  }
}
