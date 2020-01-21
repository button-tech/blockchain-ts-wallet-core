# BLOCKCHAIN-TS-WALLET-CORE
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/6fcfc61217ed4494a87ac1835c2edac2)](https://app.codacy.com/gh/button-tech/blockchain-ts-wallet-core?utm_source=github.com&utm_medium=referral&utm_content=button-tech/blockchain-ts-wallet-core&utm_campaign=Badge_Grade_Dashboard)
[![Build Status](https://travis-ci.org/button-tech/blockchain-ts-wallet-core.svg?branch=master)](https://travis-ci.org/button-tech/blockchain-ts-wallet-core)

## Installation
* `npm i -s @buttonwallet/blockchain-ts-wallet-core`  

## Usage
```typescript
import { HdWallet } from '@buttonwallet/blockchain-ts-wallet-core'  
```

### HDWallet

#### Generate mnemonic
```typescript
const phrase = HdWallet.generateMnemonic()
console.log(phrase) // control sock axis field icon jewel gown duck amateur type step save
``` 

#### Generate all key pairs
```typescript
const phrase = 'control sock axis field icon jewel gown duck amateur type step save'
const password = ''
const wallet = new HdWallet(phrase, password)

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
import { DomainEthereum } from '@buttonwallet/blockchain-ts-wallet-core'

const phrase = 'control sock axis field icon jewel gown duck amateur type step save'
const password = ''
const wallet = new HdWallet(phrase, password)

const derivationIndex = 0;
const currency = wallet.generateKeyPair(DomainEthereum.Instance(), derivationIndex);
console.log(currency)
/*
{
  privateKey: 'e3776b46699e2a6e55b19d7033b7724758b753c7391137e3eb5eaf3daed1db54',
  publicKey: '032348140ab3270e02cf9cce9e1fd3201cb9068671c490f3e2fabe0308a8afd284',
  address: '0xC9330Ce433DfB0046efc7dD8aB1A8ACC433f37Aa'
}
*/
```


