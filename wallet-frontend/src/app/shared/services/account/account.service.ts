import { Cipher } from '../security/security.service';
import { Addresses, PrivateKeys } from '../../shared.module';
import { StorageService } from '../storage/storage.service';
import { HdWallet } from '../hd-wallet/hd-wallet.service';

export class AccountService {

  constructor() {

  }

  // Cipher in case of strong encryption mode
  static saveAccount(data: string | Cipher | PrivateKeys): void {
    const storageService = new StorageService();
    if ((data as Cipher).text) {
      data = data as Cipher;
      storageService.cypherParams = { salt: data.salt, iv: data.iv };
      storageService.storage = { secret: data.text, isOldFormat: false };
    } else if (typeof data === 'string') {
      storageService.storage = { secret: data as string, isOldFormat: false };
    } else {
      storageService.storage = { secret: data as PrivateKeys, isOldFormat: true };
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

