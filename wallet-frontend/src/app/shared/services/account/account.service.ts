import { Cipher } from '../security/security.service';
import { Addresses, PrivateKeys, QrCodeData } from '../../shared.module';
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

  // Cipher in case of strong encryption mode
  static saveAccount(data: string | Cipher | PrivateKeys): void {
    const storageService = new StorageService();
    if ((data as Cipher).text) {
      data = data as Cipher;
      storageService.cypherParams = { salt: data.salt, iv: data.iv };
      storageService.storage = { secret: data.text, expired: false };
    } else if (typeof data === 'string') {
      storageService.storage = { secret: data as string, expired: false };
    } else {
      storageService.storage = { secret: data as PrivateKeys, expired: true };
    }
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

