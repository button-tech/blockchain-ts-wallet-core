import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit, OnInit, AfterContentInit, AfterContentChecked
} from '@angular/core';
import { HdWallet } from '../shared/services/hd-wallet/hd-wallet.service';
import { Options, QrCode } from '../shared/components/qrcode/qrcode.service';
import { StorageService } from '../shared/services/storage/storage.service';
import { Security } from '../shared/services/security/security.service';
import { QrCodeData } from '../shared/shared.module';
import { NodeApiProvider } from '../shared/providers/node-api.provider';
import { RenderQrcodeComponent } from '../shared/components/qrcode/renderQrcode/renderQrcode.component';
import { AccountService } from '../shared/services/account/account.service';

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
  isQrCodeHidden = true;

  data: Array<IRow> = [];
  words: string;
  password = '';

  @ViewChild(RenderQrcodeComponent, { static: false })
  private renderQrCode: RenderQrcodeComponent;

  constructor(private nodeApi: NodeApiProvider) {
  }

  createAccount() {
    const mnemonic = this.generateMnemonic();

    this.isQrCodeHidden = false;
    this.words = mnemonic;

    console.log(mnemonic);
  }

  private generateMnemonic() {
    const newMnemonic = HdWallet.generateMnemonic();
    const cipher = Security.encryptSecret(newMnemonic, this.password);
    this.renderQrCode.render(cipher);

    AccountService.saveAccount(newMnemonic);

    // test purpose
    return Security.decryptSecret(cipher.text, this.password, cipher.salt, cipher.iv);
  }

  async generateKeyPairs() {
    const hdWallet = new HdWallet(this.words, this.password);
    const { btc, ltc, eth, bch, etc, waves, xlm, ton } = hdWallet.generateAllKeyPairs(0);

    this.data = [
      { label: 'BTC', address: btc.address, privateKey: btc.privateKey },
      { label: 'LTC', address: ltc.address, privateKey: ltc.privateKey },
      { label: 'BCH', address: bch.address, privateKey: bch.privateKey },
      { label: 'ETH', address: eth.address, privateKey: eth.privateKey },
      { label: 'ETC', address: etc.address, privateKey: etc.privateKey },
      { label: 'XLM', address: xlm.address, privateKey: xlm.privateKey },
      { label: 'Waves', address: waves.address, privateKey: waves.privateKey },
      { label: 'TON', address: (await ton.address)[0], privateKey: ton.privateKey },
    ];
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.createAccount();
      this.generateKeyPairs();
    });


  }

}
