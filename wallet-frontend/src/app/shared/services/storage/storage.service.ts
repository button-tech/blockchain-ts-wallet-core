export interface Storage {
  secret: string | PrivateKeys;
  expired: boolean; // false - mnemonic; true - privateKeys
}

// for old version
export interface PrivateKeys {
  Waves: string;
  Ethereum: string;
  Bitcoin: string;
  BitcoinCash: string;
  Litecoin: string;
  EthereumClassic: string;
  Stellar: string;
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
    this.writeSecret(storage);
  }

  get cypherParams(): CypherParams {
    return this.cp;
  }

  set cypherParams(cp: CypherParams) {
    this.writeCypherParams(cp);
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
      this.secretStorage = {
        secret: JSON.parse(privateKeys),
        expired: true
      };
      return;
    }
  }

  private readCypherParams(): void {
    const iv = localStorage.getItem('iv');
    const salt = localStorage.getItem('salt');
    const cp: CypherParams = { iv, salt };
    this.cp = cp;
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
