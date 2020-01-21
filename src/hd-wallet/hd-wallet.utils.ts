export function hasStrongRandom(): boolean {
  return 'crypto' in window && window.crypto !== null;
}

export function uint8ArrayToHex(a: Uint8Array): string {
  let s = '';
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < a.length; i++) {
    let h = a[i].toString(16);
    while (h.length < 2) {
      h = '0' + h;
    }
    s = s + h;
  }
  return s;
}

export interface KeyPair {
  privateKey: string;
  publicKey: string;
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

  waves: "m/44'/5741564'/0'/0'/",
  stellar: "m/44'/148'/",
  ton: "m/44'/396'/"
};

export interface MyExtendedKeyPair {
  extendedPrivateKey: any;
  extendedPublicKey: any;
}

// before displayBip32Info
export function generateExtendedKeyPair(
  bip32RootKey: any,
  bip32ExtendedKey: any
): MyExtendedKeyPair {
  // Display the key
  // const rootKey = bip32RootKey.toBase58();

  let xprvkeyB58 = 'NA';
  if (!bip32ExtendedKey.isNeutered()) {
    xprvkeyB58 = bip32ExtendedKey.toBase58();
  }

  return {
    extendedPrivateKey: xprvkeyB58,
    extendedPublicKey: bip32ExtendedKey.neutered().toBase58()
  };
}
