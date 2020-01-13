import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
import {HdWallet} from '../shared/services/hd-wallet/hd-wallet.service';
import {Options, QrCode} from '../shared/components/qrcode/qrcode.service';
import {StorageService} from '../shared/services/storage/storage.service';
import {Security} from '../shared/services/security/security.service';
import {QrCodeData} from '../shared/shared.module';
import {NodeApiProvider} from "../shared/providers/node-api.provider";

interface IRow {
  label: string;
  address: string;
  privateKey: string;
}

@Component({
  selector: 'app-create-account',
  templateUrl: './hd-wallet.component.html',
  styles: [
      `th, td {
      border: 1px solid black;
      padding: 10px;
    }

    button {
      width: 200px;
      margin-top: 20px;
      margin-bottom: 20px;
    }`
  ]
})
export class HdWalletComponent implements AfterViewInit {
  data: Array<IRow> = [];
  words: string;
  password = '';

  @ViewChild('qrcode', {static: false}) qrcode: ElementRef;

  constructor(private nodeApi: NodeApiProvider) {
  }

  generateMnemonic() {
    const newMnemonic = HdWallet.generateMnemonic();

    const s = new StorageService();

    document.querySelector('div#qrcode').innerHTML = '';

    const cypher = Security.encryptSecret(newMnemonic, this.password);
    s.cypherParams = {salt: cypher.salt, iv: cypher.iv};
    s.storage = {secret: cypher.text, isOldFormat: false};

    const qrData: QrCodeData = {
      mnemonic: cypher.text,
      iv: cypher.iv,
      salt: cypher.salt
    };

    const opt: Options = {text: JSON.stringify(qrData)};
    const qr = new QrCode();
    qr.render(opt, this.qrcode);

    this.words = newMnemonic;

    const mnemonic = Security.decryptSecret(cypher.text, this.password, cypher.salt, cypher.iv);
    console.log(mnemonic);
  }

  async generateKeyPairs() {
    const hdWallet = new HdWallet(this.words, this.password);
    const {btc, ltc, eth, bch, etc, waves, xlm, ton} = hdWallet.generateAllKeyPairs(0);

    this.data = [
      {label: 'BTC', address: btc.address, privateKey: btc.privateKey},
      {label: 'LTC', address: ltc.address, privateKey: ltc.privateKey},
      {label: 'BCH', address: bch.address, privateKey: bch.privateKey},
      {label: 'ETH', address: eth.address, privateKey: eth.privateKey},
      {label: 'ETC', address: etc.address, privateKey: etc.privateKey},
      {label: 'XLM', address: xlm.address, privateKey: xlm.privateKey},
      {label: 'Waves', address: waves.address, privateKey: waves.privateKey},
      {label: 'TON', address: (await ton.address)[0], privateKey: ton.privateKey},
    ];
  }


  ngAfterViewInit() {
    this.generateMnemonic();
    this.generateKeyPairs();
  }

}
