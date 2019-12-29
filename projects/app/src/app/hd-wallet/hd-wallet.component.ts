import { Component, OnInit } from '@angular/core';
import { HdWallet } from '../shared/hd-wallet/hd-wallet.service';

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
export class HdWalletComponent implements OnInit {
  data: Array<IRow> = [];
  words: string;
  password: string;

  generateMnemonic() {
    const newMnemonic = HdWallet.generateMnemonic();
    this.words = newMnemonic;
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
      // { label: 'TON', address: ton.address, privateKey: ton.privateKey },
    ];
  }

  ngOnInit(): void {
    this.generateMnemonic();
    this.generateKeyPairs();
  }
}
