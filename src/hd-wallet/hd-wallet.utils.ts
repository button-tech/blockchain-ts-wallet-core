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
