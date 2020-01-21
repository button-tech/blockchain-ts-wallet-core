import { mnemonicToSeedSync } from 'bip39';
import * as bip32 from 'bip32';
import { hdPath, KeyPair } from './hd-wallet.utils';
import { BitcoinCashConfig, BitcoinConfig, LitecoinConfig, Network } from '../networks';
import { MnemonicDescriptor } from '../types';
import { IDomainCurrency } from '../DomainCurrency';

export function getSecp256k1KeyPair(
  currency: IDomainCurrency,
  mnemonic: MnemonicDescriptor
): KeyPair {
  const keys = generateSecp256k1KeyPair(
    mnemonic.phrase,
    hdPath[currency.full],
    mnemonic.index,
    getConfig(currency),
    mnemonic.password
  );
  return getKeyPair(keys);
}

function getKeyPair(keys: bip32.BIP32Interface): KeyPair {
  if (keys.privateKey === undefined) {
    throw new Error('private key undefined');
  }
  return {
    privateKey: keys.privateKey.toString('hex'),
    publicKey: keys.publicKey.toString('hex')
  };
}

function generateSecp256k1KeyPair(
  mnemonic: string,
  path: string,
  index: number = 0,
  network?: Network,
  password?: string
): bip32.BIP32Interface {
  const seed = mnemonicToSeedSync(mnemonic, password);
  const bip32RootKey = bip32.fromSeed(seed, network);
  const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, path);
  return bip32ExtendedKey.derive(index);
}

function calcBip32ExtendedKey(extendedKey: bip32.BIP32Interface, path: string) {
  // Derive the key from the path
  const pathBits = path.split('/');
  for (let i = 0; i < pathBits.length; i++) {
    const bit = pathBits[i];
    const index = parseInt(bit, 10);
    if (isNaN(index)) {
      continue;
    }

    const hardened = bit[bit.length - 1] === "'";
    const isPrivate = !extendedKey.isNeutered();
    const invalidDerivationPath = hardened && !isPrivate;
    if (invalidDerivationPath) {
      // @ts-ignore
      extendedKey = null;
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index);
    } else {
      extendedKey = extendedKey.derive(index);
    }
  }
  return extendedKey;
}

function getConfig(currency: IDomainCurrency): Network {
  switch (currency.short) {
    case 'ltc':
      return LitecoinConfig;
    case 'bch':
      return BitcoinCashConfig;
    default:
      return BitcoinConfig;
  }
}
