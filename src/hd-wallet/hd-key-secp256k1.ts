import { mnemonicToSeedSync } from 'bip39'
import * as bip32 from 'bip32'
import { hdPath, KeyPair } from './hd-wallet.utils'
import { BitcoinCashConfig, BitcoinConfig, LitecoinConfig, Network } from '../networks'

export function getBitcoinKeyPair(mnemonic: string, index: number = 0, password?: string): KeyPair {
  const keys = generateSecp256k1KeyPair(mnemonic, hdPath.bitcoin, index, BitcoinConfig, password)
  return getKeyPair(keys)
}

export function getBitcoinCashKeyPair(
  mnemonic: string,
  index: number = 0,
  password?: string
): KeyPair {
  const keys = generateSecp256k1KeyPair(
    mnemonic,
    hdPath.bitcoincash,
    index,
    BitcoinCashConfig,
    password
  )
  return getKeyPair(keys)
}

export function getLitecoinKeyPair(
  mnemonic: string,
  index: number = 0,
  password?: string
): KeyPair {
  const keys = generateSecp256k1KeyPair(mnemonic, hdPath.litecoin, index, LitecoinConfig, password)
  return getKeyPair(keys)
}

export function getEthereumKeyPair(
  mnemonic: string,
  index: number = 0,
  password?: string
): KeyPair {
  const keys = generateSecp256k1KeyPair(mnemonic, hdPath.ethereum, index, BitcoinConfig, password)
  return getKeyPair(keys)
}

export function getEthereumClassicKeyPair(
  mnemonic: string,
  index: number = 0,
  password?: string
): KeyPair {
  const keys = generateSecp256k1KeyPair(
    mnemonic,
    hdPath.ethereumClassic,
    index,
    BitcoinConfig,
    password
  )
  return getKeyPair(keys)
}

function getKeyPair(keys: bip32.BIP32Interface): KeyPair {
  if (keys.privateKey === undefined) {
    throw new Error('private key undefined')
  }
  return {
    privateKey: keys.privateKey.toString('hex'),
    publicKey: keys.publicKey.toString('hex')
  }
}

function generateSecp256k1KeyPair(
  mnemonic: string,
  path: string,
  index: number = 0,
  network?: Network,
  password?: string
): bip32.BIP32Interface {
  const seed = mnemonicToSeedSync(mnemonic, password)
  const bip32RootKey = bip32.fromSeed(seed, network)
  const bip32ExtendedKey = calcBip32ExtendedKey(bip32RootKey, path)
  return bip32ExtendedKey.derive(index)
}

function calcBip32ExtendedKey(extendedKey: bip32.BIP32Interface, path: string) {
  // Derive the key from the path
  const pathBits = path.split('/')
  for (let i = 0; i < pathBits.length; i++) {
    const bit = pathBits[i]
    const index = parseInt(bit, 10)
    if (isNaN(index)) {
      continue
    }

    const hardened = bit[bit.length - 1] === "'"
    const isPrivate = !extendedKey.isNeutered()
    const invalidDerivationPath = hardened && !isPrivate
    if (invalidDerivationPath) {
      // @ts-ignore
      extendedKey = null
    } else if (hardened) {
      extendedKey = extendedKey.deriveHardened(index)
    } else {
      extendedKey = extendedKey.derive(index)
    }
  }
  return extendedKey
}
