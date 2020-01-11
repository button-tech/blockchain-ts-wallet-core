import { IsJson, PrivateKeys, QrCodeData, TryParse } from '../../shared.module';
import { Security } from '../security/security.service';

export class Decryption {

  constructor() {
  }

  decryptQrCodeData(qrRawData: string, password: string): string | PrivateKeys | Error {
    if (IsJson(qrRawData)) {
      return this.decryptMnemonicVersion(qrRawData, password);
    }
    return this.decryptPrivateKeysVersion(qrRawData, password);
  }

  private decryptMnemonicVersion(qrRawData: string, password: string): string | Error {
    const [ok, qrData] = TryParse<QrCodeData>(qrRawData);
    if (!ok || !qrData.mnemonic) {
      return Error('qr code doesn\'t contain secret keys');
    }
    try {
      return Security.decryptSecret(qrData.mnemonic, password, qrData.salt, qrData.iv);
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }

  private decryptPrivateKeysVersion(qrRawData: string, password: string): PrivateKeys | Error {
    try {
      const privateKeysJson = Security.decryptSecret(qrRawData.toString(), password);
      const [ok, privateKeys] = TryParse<PrivateKeys>(privateKeysJson);
      if (!ok || !privateKeys.Ethereum) {
        return Error('qr code doesn\'t contain secret keys');
      }
      return privateKeys;
    } catch (e) {
      return new Error('wrong password or qr code');
    }
  }
}


