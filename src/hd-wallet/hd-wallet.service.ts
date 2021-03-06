import { Network, payments } from 'bitcoinjs-lib-cash';
import { privateToAddress, addHexPrefix, toChecksumAddress } from 'ethereumjs-util';
import { address } from '@waves/ts-lib-crypto';
import { entropyToMnemonic, validateMnemonic } from 'bip39';
import { EnDict } from './wordlist.en';
import basex from 'base-x';
import randomBytes from 'randombytes';

import {
  DomainBitcoin,
  DomainBitcoinCash,
  DomainEthereum,
  DomainEthereumClassic,
  IDomainCurrency,
  DomainLitecoin,
  DomainStellar,
  DomainWaves,
  DomainPOA
} from '../DomainCurrency';
import { getSecp256k1KeyPair } from './hd-key-secp256k1';
import { BitcoinCashConfig, BitcoinConfig, LitecoinConfig } from '../networks';
import { getEd25519KeyPair } from './hd-key-ed25519';
import { Buffer } from 'buffer';
import { Keys, MnemonicDescriptor } from '../types';

type NumWords = 12 | 15 | 18 | 21 | 24;

export interface Currencies {
  eth: Keys;
  etc: Keys;
  btc: Keys;
  ltc: Keys;
  bch: Keys;
  waves: Keys;
  xlm: Keys;
  poa: Keys;
  // ton: Keys;
}

export class HdWallet {
  private readonly words: string;

  constructor(mnemonic: string, private password: string = '') {
    this.words = mnemonic;
  }

  static isValidMnemonic(mnemonic: string): boolean {
    return validateMnemonic(mnemonic, EnDict);
  }

  static generateMnemonic(numWords: NumWords = 12): string {
    // get the amount of entropy (bits) to use
    const strength = (numWords / 3) * 32;

    // words | strength
    // 12   -> 128 bit / 16 bytes
    // 15   -> 160 bit / 20 bytes
    // 18   -> 192 bit / 24 bytes
    // 21   -> 224 bit / 28 bytes
    // 24   -> 256 bit / 32 bytes
    const entropy = randomBytes(strength / 8);
    return entropyToMnemonic(Buffer.from(entropy).toString('hex'), EnDict);
  }

  generateAllKeyPairs(index: number): Currencies {
    const keyPairsObject = Object.create(null);

    const currencies: Array<IDomainCurrency> = [
      DomainEthereum.Instance(),
      DomainEthereumClassic.Instance(),
      DomainBitcoin.Instance(),
      DomainBitcoinCash.Instance(),
      DomainLitecoin.Instance(),
      DomainWaves.Instance(),
      DomainStellar.Instance(),
      DomainPOA.Instance()
      // DomainTON.Instance()
    ];

    for (let cur of currencies) {
      keyPairsObject[cur.short] = this.generateKeyPair(cur, index);
    }

    return keyPairsObject;
  }

  generateKeyPair(currency: IDomainCurrency, index: number): Keys {
    const mnemonic = new MnemonicDescriptor(this.words, index, this.password);
    switch (currency.short) {
      case 'eth':
      case 'etc':
      case 'poa':
        const ethKeys = getSecp256k1KeyPair(currency, mnemonic);
        return {
          privateKey: ethKeys.privateKey,
          publicKey: ethKeys.publicKey,
          address: this.getEthereumAddress(ethKeys.privateKey)
        };

      case 'btc':
      case 'bch':
      case 'ltc':
        const utxoKeys = getSecp256k1KeyPair(currency, mnemonic);
        const utxoAddress = this.getUtxoAddress(currency, utxoKeys.publicKey);
        return {
          publicKey: utxoKeys.publicKey,
          privateKey: utxoKeys.privateKey,
          address: utxoAddress
        };

      case 'waves':
        const wavesKeys = getEd25519KeyPair(currency, mnemonic);
        return {
          privateKey: wavesKeys.privateKey,
          publicKey: wavesKeys.publicKey,
          address: this.buildWavesAddress(wavesKeys.publicKey)
        };

      case 'xlm':
        const stellarKeyPair = getEd25519KeyPair(currency, mnemonic);
        return {
          publicKey: stellarKeyPair.publicKey,
          privateKey: stellarKeyPair.privateKey,
          address: stellarKeyPair.publicKey
        };

      // case 'ton':
      //   const tonKeyPair = this.generateEd25519KeyPair(hdPath.ton, index);
      //   const pvk = tonKeyPair.key.toString('hex');
      //   const keyPair = (window as any).nacl.sign.keyPair.fromSeed(tonKeyPair.key);
      //   return {
      //     privateKey: pvk,
      //     address: (window as any).wallet_creation_generate_external_message(keyPair, '-1')
      //   };

      default:
        throw new Error('this currency not supported');
    }
  }

  private getEthereumAddress(privateKey: string): string {
    const addressBuffer = privateToAddress(Buffer.from(privateKey, 'hex'));
    const hexAddress = addressBuffer.toString('hex');
    return addHexPrefix(toChecksumAddress(hexAddress));
  }

  private buildWavesAddress(publicKey: string): string {
    const publicKey1 = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(
      Buffer.from(publicKey, 'hex')
    );
    return address({ publicKey: publicKey1 });
  }

  private getUtxoAddress(currency: IDomainCurrency, publicKey: string): string {
    const btcOpt = {
      pubkey: Buffer.from(publicKey, 'hex'),
      network: this.getNetwork(currency)
    };
    const p = payments.p2pkh(btcOpt);
    return p.address!;
  }

  private getNetwork(currency: IDomainCurrency): Network {
    switch (currency.short) {
      case 'btc':
        return BitcoinConfig as Network;

      case 'bch':
        return BitcoinCashConfig as Network;

      case 'ltc':
        return LitecoinConfig as Network;

      default:
        throw new Error('config not exists in ' + currency);
    }
  }
}
