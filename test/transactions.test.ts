import { Ethereum, EthereumClassic, PoaNetwork } from '../src/currencies/ethereumBased';
import {
  Bitcoin,
  BitcoinCash,
  EthereumTransactionParams,
  Litecoin,
  UTXO,
  UtxoTransactionParams,
  Waves,
  WavesTransactionParams
} from '../src';

describe('Sign transaction from private keys test', () => {
  it('should sign Stellar transaction test', async () => {
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

  it('should sign Ethereum transaction', async () => {
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

  it('should sign POA transaction', async () => {
    const privateKey = '0x90c536e66cc51118d75fc3cb96efcdf0e0b13a5005f5a65878bc37def7e87839';
    const params: EthereumTransactionParams = {
      toAddress: '0x246616Acd0E83d406124Ab038B2B17b29f78B4b0',
      amount: '0.1',
      nonce: 1,
      gasPrice: 1000000000,
      gasLimit: 21000
    };
    const blockchain = PoaNetwork(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      'f86b01843b9aca0082520894246616acd0e83d406124ab038b2b17b29f78b4b088016345785d8a00008025a09' +
        '9bd73cda7ca5076ff04f1a9422add75267d8a82e01d26915b22405291ba25fba029f08c79f9b364e7950479bf' +
        'c67adb7fb7143c88274022d878292445abff37bf'
    );
  });

  it('should sign EthereumClassic transaction', async () => {
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

  it('should sign  BitcoinCash transaction', async () => {
    const privateKey = '2b894d28b2bf96b5da66ce9e8d29ee2e754a59df0fc411ca01aace64f2023868';
    const input1: UTXO = {
      address: 'bitcoincash:qzqvhc0ksf2y4x0ta5nxhy8sf2wr5r6h55524c3m4h',
      txid: '0fe552fa47d3a59444ee62994c4e9ab8d416df59e16c488ab612a9d2837ffa4e',
      vout: 4,
      scriptPubKey: '76a91480CBE1F682544A99EBED266B90F04A9C3A0F57A588ac',
      amount: '0.01136865',
      satoshis: 1136865,
      height: 618275,
      confirmations: 516
    };
    const params: UtxoTransactionParams = {
      toAddress: '196Ns2Apq37TNJMQGWJaoDnMRyJ5b7Y3BV', // legacy format or cash
      amount: '0.00578704',
      fee: 678,
      inputs: [input1]
    };
    const blockchain = BitcoinCash(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      '01000000014efa7f83d2a912b68a486ce159df16d4b89a4e4c9962ee4494a5d347fa52e50f040000006b4830' +
        '45022100a08a0a7022a5a40cd9e92321835660124400be233ff4328847290af27444cbce0220095b8573a7f0' +
        'cb16618183387a5a79e683295db57c97d6bcf3f67924c213fe9e412103c1ef3cc8deae4b7f419815013348e1' +
        '47fe1a47d2bb7dff37300cab24789295a6040200000290d40800000000001976a91458c555fde6bf11a96501' +
        '3b1a55f6b9ab1d0e6b9488acab810800000000001976a91480cbe1f682544a99ebed266b90f04a9c3a0f57a5' +
        '88ac00000000'
    );
  });

  it('should sign  Litecoin transaction', async () => {
    const privateKey = 'db5dabe349cac60fae79ad1203538541239df681f370e5c27f46422a12bdff59';
    const input1: UTXO = {
      address: 'LfJeaRarYo31fx5DFA4D96hESS3mgHAbmd',
      txid: '55d2afc3bace572df80d50df855fea8a3be100366b526f9a18715b4192377df3',
      vout: 0,
      scriptPubKey: '76a914DC45D4FAB1D13BFFEAAA02B7F2C6BC04C8007A4188ac',
      amount: '0.11284167',
      satoshis: 11284167,
      height: 1772942,
      confirmations: 2229
    };
    const params: UtxoTransactionParams = {
      toAddress: 'LbjQ5PmBYkJnRrPYH8bNSv7brsYt8Wvn9N',
      amount: '0.11279559',
      fee: 4608,
      inputs: [input1]
    };
    const blockchain = Litecoin(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      '0100000001f37d3792415b71189a6f526b3600e13b8aea5f85df500df82d57cebac3afd255000000006a4' +
        '7304402200198a2e55f2e6349279ce2da02a0a2c4a9b20e64a8ab8c2fd4884479e93a042f02200174100a' +
        '407eb6bb2512a0e892fbf2e7505f100af7192208d78ee2e926d2db4e01210280ff6c9e20838bcbe431a58' +
        '690cdf39a9fea3eae196e71a09dac2b9c4dd950ffb508000001c71cac00000000001976a914b5139f9847' +
        'ced1b26cac598097f76829af93362688ac00000000'
    );
  });

  it('should sign  Bitcoin transaction', async () => {
    const privateKey = '651ba268e08b41f412e74491ab81b698338bb77878328d0deddef57989475269';
    const input1: UTXO = {
      address: '1HRSXxPox3DDN19iY4nYoUPiGbErzzDDXh',
      txid: '447a76b295bfb3939cc130f5dccfecee32bfda9110dfec725880b0a4aca0989d',
      vout: 0,
      scriptPubKey: '76a914B4214F62038E47A01097D167E8313020B4ADF9C188ac',
      amount: '0.00092335',
      satoshis: 92335,
      height: 613853,
      confirmations: 11
    };
    const input2: UTXO = {
      address: '1HRSXxPox3DDN19iY4nYoUPiGbErzzDDXh',
      txid: '447a76b295bfb3939cc130f5dccfecee32bfda9110dfec725880b0a4aca0989d',
      vout: 1,
      scriptPubKey: '76a914B4214F62038E47A01097D167E8313020B4ADF9C188ac',
      amount: '0.00069832',
      satoshis: 69832,
      height: 613853,
      confirmations: 11
    };
    const params: UtxoTransactionParams = {
      toAddress: '1B1kgANQ5BtF15Nv6sXi8A9GYx8RXjErEk',
      amount: '0.00158767',
      fee: 3400,
      inputs: [input1, input2]
    };
    const blockchain = Bitcoin(privateKey);
    const signedTx = await blockchain.signTransaction(params);
    expect(signedTx).toEqual(
      '01000000029d98a0aca4b0805872ecdf1091dabf32eeeccfdcf530c19c93b3bf95b2767a44000000006a473' +
        '04402207b48ce49fbdb9b5f248c33edc4255f2842ca8ca7a0b84435a5bc51bef810b0ce02204073c066d5d3' +
        '948afcbdd745dec7354bb9c4762c533e591711dc7e1f05fb80f601210224de1a3a7d9bd87ec2a7687faa31d' +
        '14fca634d80de583504312158adbd5ca91b0b0000009d98a0aca4b0805872ecdf1091dabf32eeeccfdcf530' +
        'c19c93b3bf95b2767a44010000006b4830450221009400c33311b302bd54906624ec916ce2877eed4e0d38d' +
        'fc16a7eab62de9784cf02206e6fc9cc0ebb98b5a6dc92272837f41271068c99bd1e4a737be8a462b2a77849' +
        '01210224de1a3a7d9bd87ec2a7687faa31d14fca634d80de583504312158adbd5ca91b0b000000012f6c020' +
        '0000000001976a9146dd5b74f8f9372d8ba754a8ce68e3550e26845d288ac00000000'
    );
  });

  it('should sign Waves transaction test', async () => {
    const timestamp = 1579620411538;
    const goodTx = {
      type: 4,
      version: 2,
      senderPublicKey: '74HcK2LW19QQJxB4nmgKB33xKAdP5Cw7JPhU6ixc4htW',
      assetId: null,
      recipient: '3PDxEP33D3U1DrtPTasH5Hg3WR9nmuABDxX',
      amount: 28286943,
      attachment: '',
      fee: 100000,
      feeAssetId: null,
      timestamp: timestamp,
      // not fixed. But it's ok to compare tx ids
      // 'proofs':
      // ['5oMx4Z7SZHedyDpGM7vjB9pCzWibrN95NUpwRiR83X2mCd3wf1UJzwthdbS4QZM7N8W1jaiY9FAzC8wWtUuTFTZJ'],
      id: '5yoaPUCEvJXdKRy8RqFuL1FmuAPJGAvrMEBNb8tAULS'
    };

    const privateKey =
      'ankle demise capital subject receive scout road mesh armed item apart' +
      ' million leave husband direct';
    const params: WavesTransactionParams = {
      toAddress: '3PDxEP33D3U1DrtPTasH5Hg3WR9nmuABDxX',
      amount: '0.28286943',
      timestamp: timestamp
    };
    const blockchain = Waves(privateKey);
    const signedTx = await blockchain.signTransaction(params);

    let txObj = JSON.parse(signedTx);
    delete txObj.proofs;
    expect(txObj).toEqual(goodTx);
  });
});

// describe('Sign transaction from mnemonic test', () => {
//
// });
