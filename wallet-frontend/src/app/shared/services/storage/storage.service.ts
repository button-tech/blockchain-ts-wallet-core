import { PrivateKeys } from '../../shared.module';

export interface Storage {
  secret: string | PrivateKeys;
  isOldFormat: boolean; // false - mnemonic; true - privateKeys
}

export interface CypherParams {
  salt: string;
  iv: string;
}

export class StorageService {

  private secretStorage: Storage;
  private cp: CypherParams;

  private readonly secretFieldName = 'secret';

  constructor() {
    this.readSecret();
    this.readCypherParams();
  }

  get storage(): Storage {
    console.log(this.secretStorage);
    return this.secretStorage;
  }

  set storage(storage: Storage) {
    this.secretStorage = storage;
    this.writeSecret(storage);
  }

  get cypherParams(): CypherParams {
    return this.cp;
  }

  set cypherParams(cp: CypherParams) {
    this.cp = cp;
    this.writeCypherParams(cp);
  }

  clear() {
    this.secretStorage = null;
    this.cp = null;
    localStorage.clear();
  }

  private readSecret(): void {
    const secret = localStorage.getItem(this.secretFieldName);
    const [isOldFormat, secretData] = this.tryParseSecret(secret);
    if (secret) {
      this.secretStorage = {
        secret: secretData,
        isOldFormat
      };
      return;
    }

    // for old version
    const privateKeys = localStorage.getItem('privateKeys');
    if (privateKeys) {
      this.secretStorage = {
        secret: privateKeys ? JSON.parse(privateKeys) : null,
        isOldFormat: true
      };
      return;
    }
  }

  private readCypherParams(): void {
    const iv = localStorage.getItem('iv');
    const salt = localStorage.getItem('salt');
    this.cp = { iv, salt };
  }

  private writeCypherParams(params: CypherParams): void {
    localStorage.setItem('iv', params.iv);
    localStorage.setItem('salt', params.salt);
  }

  private writeSecret(storage: Storage): void {
    if (storage.isOldFormat) {
      storage.secret = JSON.stringify(storage.secret);
    }
    localStorage.setItem(this.secretFieldName, storage.secret.toString());
  }

  private tryParseSecret(secret: string): [boolean, string | PrivateKeys] {
    try {
      return [true, JSON.parse(secret)];
    } catch (e) {
      return [false, secret];
    }
  }

}
