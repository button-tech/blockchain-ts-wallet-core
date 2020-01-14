import { BIP32Interface, Network, Payment, payments } from 'bitcoinjs-lib-cash';
import { toCashAddress } from 'bchaddrjs';
import { privateToAddress, addHexPrefix, toChecksumAddress, bufferToHex } from 'ethereumjs-util';
import { StrKey, Keypair } from 'stellar-sdk';
import { address, publicKey } from '@waves/ts-lib-crypto';
import { derivePath } from './hd-key-ed25519';
import * as bip32 from 'bip32';
import { entropyToMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import * as basex from 'base-x';
import { EnDict } from './wordlist.en';

import {
  calcBip32ExtendedKey,
  hasStrongRandom,
  hdPath,
  networks, uint8ArrayToHex,
} from './hd-wallet.utils';
import {
  Bitcoin,
  BitcoinCash,
  Ethereum,
  EthereumClassic,
  IDomainCurrency,
  Litecoin,
  Stellar, TON,
  Waves
} from '../../DomainCurrency';

const numWords = 12;

interface Currencies {
  eth: Keys;
  etc: Keys;
  btc: Keys;
  ltc: Keys;
  bch: Keys;
  waves: Keys;
  xlm: Keys;
  ton: Keys;
}

interface Keys {
  privateKey: string;
  address: string;
}

export class HdWallet {

  private readonly words: string;

  constructor(mnemonic: string, private password: string) {
    this.words = mnemonic;
  }

  static isValidMnemonic(mnemonic: string): boolean {
    return validateMnemonic(mnemonic, EnDict);
  }

  static generateMnemonic(): string {
    if (!hasStrongRandom()) {
      alert('This browser does not support strong randomness');
      return;
    }

    // get the amount of entropy (bits) to use
    const strength = numWords / 3 * 32;

    // words | strength
    // 12   -> 128 bit / 16 bytes
    // 15   -> 160 bit / 20 bytes
    // 18   -> 192 bit / 24 bytes
    // 21   -> 224 bit / 28 bytes
    // 24   -> 256 bit / 32 bytes
    const b = new Uint8Array(strength / 8);
    const entropy = crypto.getRandomValues(b);

    return entropyToMnemonic(uint8ArrayToHex(entropy), EnDict);
  }

  generateAllKeyPairs(index: number): Currencies {
    const keyPairsObject = Object.create(null);

    const ethereum = Ethereum.Instance();
    const ethereumClassic = EthereumClassic.Instance();
    const bitcoin = Bitcoin.Instance();
    const bitcoinCash = BitcoinCash.Instance();
    const litecoin = Litecoin.Instance();
    const waves = Waves.Instance();
    const stellar = Stellar.Instance();
    const ton = TON.Instance();

    keyPairsObject[ethereum.short] = this.generateKeyPair(ethereum, index);
    keyPairsObject[ethereumClassic.short] = this.generateKeyPair(ethereumClassic, index);
    keyPairsObject[bitcoinCash.short] = this.generateKeyPair(bitcoinCash, index);
    keyPairsObject[bitcoin.short] = this.generateKeyPair(bitcoin, index);
    keyPairsObject[litecoin.short] = this.generateKeyPair(litecoin, index);
    keyPairsObject[waves.short] = this.generateKeyPair(waves, index);
    keyPairsObject[stellar.short] = this.generateKeyPair(stellar, index);
    keyPairsObject[ton.short] = this.generateKeyPair(ton, index);

    return keyPairsObject;
  }

  generateKeyPair(currency: IDomainCurrency, index: number): Keys {
    switch (currency.short) {
      case 'eth':
        const eth = this.generateSecp256k1KeyPair(hdPath.ethereum, index);
        return this.ethFromKeyPair(eth);

      case 'etc':
        const etc = this.generateSecp256k1KeyPair(hdPath.ethereumClassic, index);
        return this.ethFromKeyPair(etc);

      case 'btc':
        const btc = this.generateSecp256k1KeyPair(hdPath.bitcoin, index, networks.bitcoin);
        return {
          address: payments.p2pkh({ pubkey: btc.publicKey, network: networks.bitcoin }).address,
          privateKey: btc.privateKey.toString('hex')
        };

      case 'bch':
        const bch = this.generateSecp256k1KeyPair(hdPath.bitcoincash, index, networks.bitcoin);
        const opt: Payment = { pubkey: bch.publicKey, network: networks.bitcoin };
        const bchAddress = payments.p2pkh(opt).address;
        return {
          address: toCashAddress(bchAddress),
          privateKey: bch.privateKey.toString('hex')
        };

      case 'ltc':
        const ltc = this.generateSecp256k1KeyPair(hdPath.litecoin, index, networks.litecoin);
        return {
          address: payments.p2pkh({ pubkey: ltc.publicKey, network: networks.litecoin }).address,
          privateKey: ltc.privateKey.toString('hex')
        };

      case 'waves':
        const wavesKeyPair = this.generateEd25519KeyPair(hdPath.waves, index);
        return this.getWavesKeys(wavesKeyPair.key);

      case 'xlm':
        const stellarKeyPair = this.generateEd25519KeyPair(hdPath.stellar, index);
        return this.getStellarKeys(stellarKeyPair.key);

      case 'ton':
        const tonKeyPair = this.generateEd25519KeyPair(hdPath.ton, index);
        const pvk = tonKeyPair.key.toString('hex');
        const keyPair = (window as any).nacl.sign.keyPair.fromSeed(tonKeyPair.key);
        return {
          privateKey: pvk,
          address: (window as any).wallet_creation_generate_external_message(keyPair, '-1')
        };
    }
  }

  private generateSecp256k1KeyPair(path: string, index: number = 0, network?: Network): BIP32Interface {
    const seed = mnemonicToSeedSync(this.words, this.password);
    const bip32RootKey = bip32.fromSeed(seed, network);
    const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, path);
    return bip32ExtendedKey.derive(index);
  }

  private generateEd25519KeyPair(path: string, index: number = 0) {
    const seed = mnemonicToSeedSync(this.words, this.password);
    return derivePath(path + index + '\'', seed.toString('hex'));
  }

  private ethFromKeyPair(keyPair: BIP32Interface): Keys {
    const privateKeyBuffer = keyPair.privateKey;
    const addressBuffer = privateToAddress(privateKeyBuffer);
    const hexAddress = addressBuffer.toString('hex');

    return {
      address: addHexPrefix(toChecksumAddress(hexAddress)),
      privateKey: addHexPrefix(privateKeyBuffer.toString('hex')),
    };
  }

  private getWavesKeys(privateKey: Buffer): Keys {
    const pvk = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(privateKey);

    const pbk = publicKey({ privateKey: pvk });
    const addr = address({ publicKey: pbk });

    return {
      privateKey: pvk,
      address: addr
    };
  }

  private getStellarKeys(privateKey: Buffer): Keys {
    const secret = StrKey.encodeEd25519SecretSeed(privateKey);
    const stellarKeyPair = Keypair.fromSecret(secret);
    const pvk = stellarKeyPair.secret();
    const pbk = stellarKeyPair.publicKey();

    return {
      privateKey: pvk,
      address: pbk
    };
  }
}
