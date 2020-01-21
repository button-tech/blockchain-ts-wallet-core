export interface Network {
  wif: number
  bip32: {
    public: number
    private: number
  }
  messagePrefix?: string
  bech32?: string
  pubKeyHash?: number
  scriptHash?: number
}

export const LitecoinConfig: Network = {
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

// https://github.com/cryptocoinjs/coininfo/blob/master/lib/coins/bch.js
export const BitcoinCashConfig: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bitcoincash:q',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80
}

export const BitcoinConfig: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    private: 0x0488ade4,
    public: 0x0488b21e
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80
}
