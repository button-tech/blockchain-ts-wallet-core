# BLOCKCHAIN-TS-WALLET-CORE
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6fcfc61217ed4494a87ac1835c2edac2)](https://app.codacy.com/gh/button-tech/blockchain-ts-wallet-core?utm_source=github.com&utm_medium=referral&utm_content=button-tech/blockchain-ts-wallet-core&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/button-tech/blockchain-ts-wallet-core.svg?branch=master)](https://travis-ci.org/button-tech/blockchain-ts-wallet-core)

## About
TS library that implements wallet functionality for all multiple blockchains. Allows to create multiple private keys from one mnemonic, get public key, get address or sign transaction

### Supported blockchains

| Index   | Name             | Symbol | Logo                                                                                                                        | URL                           |
| ------- | ---------------- | ------ | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| 0       | Bitcoin          | BTC    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png" width="32" />      | <https://bitcoin.org>         |
| 2       | Litecoin         | LTC    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/litecoin/info/logo.png" width="32" />     | <https://litecoin.org>        |
| 60      | Ethereum         | ETH    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" width="32" />     | <https://ethereum.org>        |
| 61      | Ethereum Classic | ETC    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/classic/info/logo.png" width="32" />      | <https://ethereumclassic.org> |    |
| 145     | Bitcoin Cash     | BCH    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoincash/info/logo.png" width="32" />  | <https://bitcoincash.org>     |
| 148     | Stellar          | XLM    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/stellar/info/logo.png" width="32" />      | <https://stellar.org>         |
| 178     | POA Network      | POA    | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/poa/info/logo.png" width="32" />          | <https://poa.network>         |      |  |
| 5741564 | Waves            | WAVES  | <img src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/waves/info/logo.png" width="32" />        | <https://wavesplatform.com>   |


## Inpiration
[Trust Wallet: Wallet Core project](https://github.com/trustwallet/wallet-core) - C++ version for multiple platforms, except frontend. 


## Installation
* `npm i -s @buttonwallet/blockchain-ts-wallet-core`  

## Usage
```typescript
import * as TsWalletCore from '@buttonwallet/blockchain-ts-wallet-core'  
```
or
```javascript
const TsWalletCore = require('@buttonwallet/blockchain-ts-wallet-core');
```

### HDWallet

#### Generate mnemonic
```typescript
const phrase = TsWalletCore.HdWallet.generateMnemonic()
console.log(phrase) // control sock axis field icon jewel gown duck amateur type step save
``` 

#### Generate all key pairs
```typescript
const phrase = 'control sock axis field icon jewel gown duck amateur type step save'
const password = ''
const wallet = new TsWalletCore.HdWallet(phrase, password)

const derivationIndex = 0;
const currencies = wallet.generateAllKeyPairs(derivationIndex)
console.log(currencies)
/*
  eth: {
    privateKey: 'e3776b46699e2a6e55b19d7033b7724758b753c7391137e3eb5eaf3daed1db54',
    publicKey: '032348140ab3270e02cf9cce9e1fd3201cb9068671c490f3e2fabe0308a8afd284',
    address: '0xC9330Ce433DfB0046efc7dD8aB1A8ACC433f37Aa'
  },
  etc: {
    privateKey: '4e3ddb695f387f186a052409f8d0ae7c567f7e655fcfc8ed5beba155ef540f6e',
    publicKey: '030e5902714da28790c042ac1eacf514f2122665b44f6b2edcf0fc8114563821b4',
    address: '0x73974c2e5F442969b443Aed9c31Df94d854584c3'
  },
  bch: {
    address: '1F4JWB8UfqwBLpQRFGru7495Bc5y6PSZeS',
    publicKey: '0237fb66a27dae7af50ea29682fb780c700a8040f3336841f3abb5049afe49e26a',
    privateKey: '3e02ddbfd138dd84d9723d87e6d0533b298ffe54dc3b70a51d4009fb328f6b5a'
  },
  btc: {
    address: '1B7eaEtrFd2vzQDC2NcVXrbj8mCiTJDEAj',
    publicKey: '0324c0bd0f0f95c4177add9bdc40c57f1bf2472e6eaf8e67c9fa6f16f55516aed6',
    privateKey: '81beacae2014a62dedd8315325f698230fd8a8512825b5e1492a1dd4dcf05615'
  },
  ltc: {
    address: 'LMMN6Ybq87MhTf7YRfhapg33BWH53LkCgF',
    publicKey: '0273cd45409947a21a3b1ba66e947042afd4bf60a0ff1d1bf9f5af8e5ccae70a41',
    privateKey: 'd0f301b8f13f41cc53b6a5d15fd9d9920a0708076dc0233a762e306de0b0ee52'
  },
  waves: {
    privateKey: '180aa4d28f002b5a8a9381816376ea3b99fd2d6e1576a631e3d9e6ae2dac086b',
    publicKey: '3bcc2164560b1dd5557f9087b1dbb59b90601652d297a202bfe97601410dc219',
    address: '3PCAeB89wih4jnVSG9cUPptoy9AJij4c9fP'
  }
*/
```

#### Generate specific keys
```typescript
const phrase = 'control sock axis field icon jewel gown duck amateur type step save'
const password = ''
const wallet = new TsWalletCore.HdWallet(phrase, password)

const derivationIndex = 0;
const currency = wallet.generateKeyPair(TsWalletCore.DomainEthereum.Instance(), derivationIndex);
console.log(currency)
/*
{
  privateKey: 'e3776b46699e2a6e55b19d7033b7724758b753c7391137e3eb5eaf3daed1db54',
  publicKey: '032348140ab3270e02cf9cce9e1fd3201cb9068671c490f3e2fabe0308a8afd284',
  address: '0xC9330Ce433DfB0046efc7dD8aB1A8ACC433f37Aa'
}
*/
```

### Transaction Example

You can find an example how to sign transactions for different blockchains [here](https://github.com/button-tech/blockchain-ts-wallet-core/blob/master/test/transactions.test.ts)

```typescript
// TsWalletCore.MnemonicDescriptor or private key
const privateKey = '04e17ebf3b33a81a98ee779e50b725e03bbbacaca689c9f02a465800dd955e7c';

// transaction parameters (specific almost for each blockchain)
const params: TsWalletCore.TransactionParams = {
  toAddress: '0x6f387b7d5FA35a874218128E778F568294069e4C',
  amount: '0.00059655',
  nonce: 342,
  gasPrice: 7200000000,
  gasLimit: 21000
};
const blockchain = TsWalletCore.Ethereum(privateKey);
const signedTx = blockchain.signTransaction(params)
  .then(console.log)
/*
f86d8201568501ad274800825208946f387b7d5fa35a874218128e778f568294069e4c87021e8f1ed73c008025a0af698edeaae7cfb5a7c6b5091f000baaaa741a9cd7cf60e53dccc21a1dcec22fa03ad3edf9cfc535c21e4d4ddebccad05ea07d3d09bba1be9fdffc40ce2adef040
*/
```


# Contributing

The best way to submit feedback and report bugs is to [open a GitHub issue](https://github.com/button-tech/blockchain-ts-wallet-core/issues/new)

# License

blockchain-ts-wallet-core is available under the MIT license. See the [LICENSE](LICENSE) file for more info.


