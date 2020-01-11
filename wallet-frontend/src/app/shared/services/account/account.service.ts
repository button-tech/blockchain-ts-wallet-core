import { Cipher } from '../security/security.service';
import { Addresses, QrCodeData } from '../../shared.module';
import { Options, QrCode } from '../../components/qrcode/qrcode.service';
import { ElementRef } from '@angular/core';
import { StorageService } from '../storage/storage.service';
import { HdWallet } from '../hd-wallet/hd-wallet.service';

// todo: make it with module
export class AccountService {

  constructor() {

  }

  static generateQrCode(elem: ElementRef, cipher: Cipher): void {
    const qrData: QrCodeData = {
      mnemonic: cipher.text,
      iv: cipher.iv,
      salt: cipher.salt
    };
    const qrCodeData = { text: JSON.stringify(qrData) };
    const qr = new QrCode();
    qr.render(qrCodeData, elem);
  }

  static saveAccount(cipher: Cipher): void {
    const storageService = new StorageService();
    storageService.cypherParams = { salt: cipher.salt, iv: cipher.iv };
    storageService.storage = { secret: cipher.text, expired: false };
  }

  static generateKeyPairs(mnemonic: string, password: string): Addresses {
    const hdWallet = new HdWallet(mnemonic, password);
    const { btc, ltc, eth, bch, etc, waves, xlm } = hdWallet.generateAllKeyPairs(0);
    return {
      Bitcoin: btc.address,
      Litecoin: ltc.address,
      BitcoinCash: bch.address,
      Ethereum: eth.address,
      EthereumClassic: etc.address,
      Stellar: xlm.address,
      Waves: waves.address
    };
  }
}

