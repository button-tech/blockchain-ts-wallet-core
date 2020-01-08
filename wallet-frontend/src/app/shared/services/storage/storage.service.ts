export interface Storage {
  secret: string | PrivateKeys;
  expired: boolean; // false - mnemonic; true - privateKeys
}

// for old version
export interface PrivateKeys {
  waves: string;
  ethereum: string;
  bitcoin: string;
  bitcoinCash: string;
  litecoin: string;
  ethereumClassic: string;
  stellar: string;
}

export interface CypherParams {
  salt: string;
  iv: string;
}

export class StorageService {

  private secretStorage: Storage;
  private cp: CypherParams;

  constructor() {
    this.readSecret();
    this.readCypherParams();
  }

  get storage(): Storage {
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
    this.cypherParams = cp;
    this.writeCypherParams(cp);
  }

  clear() {
    this.secretStorage = null;
    this.cp = null;
    localStorage.clear();
  }

  updateStorage(): void {
    this.writeSecret(this.secretStorage);
    this.writeCypherParams(this.cypherParams);
  }

  private readSecret(): void {
    const mnemonic = localStorage.getItem('mnemonic');
    if (mnemonic) {
      this.storage = {
        secret: mnemonic,
        expired: false
      };
      return;
    }

    const privateKeys = localStorage.getItem('privateKeys');
    if (privateKeys) {
      const secret = privateKeys ? JSON.parse(privateKeys) : null;
      this.secretStorage = {
        secret,
        expired: true
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
    if (storage.expired) {
      const privateKeys = JSON.stringify(storage.secret);
      localStorage.setItem('privateKeys', privateKeys);
    } else {
      localStorage.setItem('mnemonic', storage.secret.toString());
    }
  }

}
