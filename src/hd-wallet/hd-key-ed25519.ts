import { createHmac } from 'crypto'
import { Buffer } from 'buffer'
import { mnemonicToSeedSync } from 'bip39'
import { hdPath, KeyPair } from './hd-wallet.utils'
import { StrKey, Keypair } from 'stellar-sdk'
import { box } from 'tweetnacl'
import { getBitcoinKeyPair } from './hd-key-secp256k1'

const ED25519_CURVE = 'ed25519 seed'
const HARDENED_OFFSET = 0x80000000

interface Key {
  key: Buffer
  chainCode: Buffer
}

interface BufferKeyPair {
  privateKey: Buffer
  publicKey: Buffer
}

export function getStellarKeyPair(mnemonic: string, index: number = 0, password?: string): KeyPair {
  const keyPair = generateEd25519KeyPair(mnemonic, hdPath.stellar, index, password)
  const secret = StrKey.encodeEd25519SecretSeed(keyPair.privateKey)
  const stellarKeyPair = Keypair.fromSecret(secret)
  return {
    privateKey: stellarKeyPair.secret(),
    publicKey: stellarKeyPair.publicKey()
  }
}

export function getWavesKeyPair(mnemonic: string, index: number = 0, password?: string): KeyPair {
  const keyPair = generateEd25519KeyPair(mnemonic, hdPath.stellar, index, password)
  // const privateKey = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(
  //   new Buffer(keyPair.privateKey, 'hex')
  // );
  return {
    privateKey: keyPair.privateKey.toString('hex'),
    publicKey: keyPair.publicKey.toString('hex')
  }
}

function generateEd25519KeyPair(
  mnemonic: string,
  path: string,
  index: number = 0,
  password?: string
): BufferKeyPair {
  const seed = mnemonicToSeedSync(mnemonic, password)
  const keys = derivePath(path + index + "'", seed.toString('hex'))
  return {
    privateKey: keys.key,
    publicKey: getPublicKey(keys.key)
  }
}

const derivePath = (path: string, seed: string): Key => {
  if (!isValidPath(path)) {
    throw new Error('Invalid derivation path')
  }
  const { key, chainCode } = getMasterKeyFromSeed(seed)
  const segments = path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    .map(el => parseInt(el, 10))
  return segments.reduce((parentKeys, segment) => CKDPriv(parentKeys, segment + HARDENED_OFFSET), {
    key,
    chainCode
  })
}

const getMasterKeyFromSeed = (seed: string): Key => {
  const hmac = createHmac('sha512', ED25519_CURVE)
  const I = hmac.update(new Buffer(seed, 'hex')).digest()
  const IL = I.slice(0, 32)
  const IR = I.slice(32)
  return {
    key: IL,
    chainCode: IR
  }
}

// @ts-ignore
const CKDPriv = ({ key, chainCode }: Key, index: any): Key => {
  const indexBuffer = Buffer.allocUnsafe(4)
  indexBuffer.writeUInt32BE(index, 0)
  const data = Buffer.concat([Buffer.alloc(1, 0), key, indexBuffer])
  const I = createHmac('sha512', chainCode)
    .update(data)
    .digest()
  const IL = I.slice(0, 32)
  const IR = I.slice(32)
  return {
    key: IL,
    chainCode: IR
  }
}

const replaceDerive = (val: string) => val.replace("'", '')
const pathRegex = new RegExp("^m(\\/[0-9]+')+$")
const isValidPath = (path: string) => {
  if (!pathRegex.test(path)) {
    return false
  }

  return !path
    .split('/')
    .slice(1)
    .map(replaceDerive)
    // @ts-ignore
    .some(isNaN)
}

function getPublicKey(privateKey: Buffer): Buffer {
  return new Buffer(box.keyPair.fromSecretKey(privateKey).publicKey)
}
