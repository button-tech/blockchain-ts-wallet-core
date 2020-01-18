import { BIP32Interface, Network } from 'bitcoinjs-lib-cash'

export function hasStrongRandom(): boolean {
  return 'crypto' in window && window.crypto !== null
}

export function uint8ArrayToHex(a: Uint8Array): string {
  let s = ''
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < a.length; i++) {
    let h = a[i].toString(16)
    while (h.length < 2) {
      h = '0' + h
    }
    s = s + h
  }
  return s
}

export const hdPath = {
  bitcoin: "m/44'/0'/0'/0",
  litecoin: "m/44'/2'/0'/0",
  ripple: "m/44'/144'/0'/0",
  bitcoincash: "m/44'/145'/0'/0",

  // ETH forks
  ethereum: "m/44'/60'/0'/0",
  ethereumClassic: "m/44'/61'/0'/0",
  poa: "m/44'/178'/0'/0",
  tron: "m/44'/195'/0'/0",

  waves: "m/44'/5741564'/",
  stellar: "m/44'/148'/",
  ton: "m/44'/396'/"
}

// Other networks requires different networks handling
const BitcoinNetwork: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80
}

const LitecoinNetwork: Network = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0
}

export const networks = {
  bitcoin: BitcoinNetwork,
  litecoin: LitecoinNetwork
}

export function calcBip32ExtendedKey(extendedKey: BIP32Interface, path: string) {
  // Check there's a root key to derive from
  // debugger
  // if (!bip32RootKey) {
  //   return bip32RootKey;
  // }
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

export interface MyExtendedKeyPair {
  extendedPrivateKey: any
  extendedPublicKey: any
}

// before displayBip32Info
export function generateExtendedKeyPair(
  bip32RootKey: any,
  bip32ExtendedKey: any
): MyExtendedKeyPair {
  // Display the key
  // const rootKey = bip32RootKey.toBase58();

  let xprvkeyB58 = 'NA'
  if (!bip32ExtendedKey.isNeutered()) {
    xprvkeyB58 = bip32ExtendedKey.toBase58()
  }

  return {
    extendedPrivateKey: xprvkeyB58,
    extendedPublicKey: bip32ExtendedKey.neutered().toBase58()
  }
}
