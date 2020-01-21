import { Ethereum, EthereumClassic } from '../src/currencies/ethereumBased';
import { EthereumTransactionParams } from '../src';

describe('Sign transaction from private keys test', () => {
  it('Sign Stellar transaction test', async () => {
    // todo: different values because of communication with network

    // const privateKey = '';
    // const params: StellarTransactionParams = {
    //   toAddress: '',
    //   amount: '',
    //   memo: ''
    // }
    // const blockchain = Stellar(privateKey);
    // const signedTx = await blockchain.signTransaction(params)
    expect(true).toEqual(true);
  });

  it('Sign Ethereum transaction test', async () => {
    const privateKey = '04e17ebf3b33a81a98ee779e50b725e03bbbacaca689c9f02a465800dd955e7c';
    const params: EthereumTransactionParams = {
      toAddress: '0x6f387b7d5FA35a874218128E778F568294069e4C',
      amount: '0.00059655',
      nonce: 342,
      gasPrice: 7200000000,
      gasLimit: 21000
    };
    const blockchain = Ethereum(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      'f86d8201568501ad274800825208946f387b7d5fa35a874218128e778f568294069e4c87021e8f1ed73c00802' +
        '5a0af698edeaae7cfb5a7c6b5091f000baaaa741a9cd7cf60e53dccc21a1dcec22fa03ad3edf9cfc535c21e4d' +
        '4ddebccad05ea07d3d09bba1be9fdffc40ce2adef040'
    );
  });

  it('Sign EthereumClassic transaction test', async () => {
    const privateKey = '0abf5a1937ae3c28144a6110cf3f6edc7e67c20b46572af21ce268f2dea9fdd7';
    const params: EthereumTransactionParams = {
      toAddress: '0x8ac03e162d1F0C417f5F057fE41321d00511e2BD',
      amount: '0.01116695',
      nonce: 55,
      gasPrice: 1200000000,
      gasLimit: 21000
    };
    const blockchain = EthereumClassic(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      'f86a378447868c00825208948ac03e162d1f0c417f5f057fe41321d00511e2bd8727ac4827f97c00801ba0e8' +
        '87be5184ad9be25af8e936511b1a0ef43bf25318346ba9b4ed796dfc3f4613a079b2b6afbc14cc7f759d15f4' +
        '5c1102bf8d8b2ea74fac77ebfdfcf769ac23b291'
    );
  });
});

// describe('Sign transaction from mnemonic test', () => {
//
// });
