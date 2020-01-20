import { Ethereum, EthereumClassic } from '../src/currencies/ethereumBased';
import { Bitcoin, BitcoinCash, Litecoin } from '../src/currencies/utxoBased';
import { Stellar } from '../src/currencies/stellar';
import { Waves } from '../src/currencies/waves';
import { MnemonicDescriptor } from '../src';

describe('Addresses from private keys test', () => {
  it('Ethereum address test', () => {
    const privateKey = '0x61767b546ad545f954aef85fed6bbbe270ce2863403e5e74c1ca2c437aef0da8';
    const address = Ethereum(privateKey).getAddress();
    expect(address).toEqual('0xd9E5EFAEBFf27a5aAF6eD173a85709c6C21c3386');
  });

  it('Ethereum Classic address test', () => {
    const privateKey = '0xb8f418168a58e712e9f7512bf8eab4c8afcdcf464784bacadb8e4d4f2dfc005f';
    const address = EthereumClassic(privateKey).getAddress();
    expect(address).toEqual('0x50aea0eD2CFdB7354D2F07F24c476F25e31cad5C');
  });

  it('Bitcoin address test', () => {
    const privateKey = '41c380a8af1d5ba164da7b1d224a3532c1f6c97bfe209dda6dedbe73eae3e5ea';
    const address = Bitcoin(privateKey).getAddress();
    expect(address).toEqual('1JfNTQgPCyX1MBRXheh7tHfndyqzS1UMZX');
  });

  it('BitcoinCash address test', () => {
    const privateKey = '91485a3431fe3fb2772ed0765ab7ddb6fa5ee6fcfc4b2fc0dff991503e20d39e';
    const address = BitcoinCash(privateKey).getAddress();
    expect(address).toEqual('bitcoincash:qz489et46v0rkajzy8drtd42w72hlm3cnykjhsqa08');
  });

  it('Litecoin address test', () => {
    const privateKey = '4551fdce10cbb2c25a51d6ddb826c1fbb195663c4e4609237e598ffadb439355';
    const address = Litecoin(privateKey).getAddress();
    expect(address).toEqual('LbeUytCM2yz7cuQRsbUvpxuhH8cZxw24bw');
  });

  it('Stellar address test', () => {
    const privateKey = 'SCKH63JBZTZAUCZES5S4RRICUCWGRWADE3EXQZCYZVF66YJFEFWOGAHD';
    const address = Stellar(privateKey).getAddress();
    expect(address).toEqual('GBT366KVNSQXAFVOXNZDJQJF2RHXVOSH7Y2MOGKOJZYAIGVDPVO5ITAY');
  });

  it('Waves address test', () => {
    const privateKey = 'c0ca8a85df32da6c9bc652208b046d3e97c4c2f2daa14a5336b43dcd24227479';
    const address = Waves(privateKey).getAddress();
    expect(address).toEqual('3PDn2Sqwdz7Zbj6PJcNniRYKdLR3U3DJabR');
  });
});

describe('Addresses from mnemonic test', () => {
  const mnemonic = new MnemonicDescriptor(
    'control sock axis field icon jewel gown duck amateur type step save',
    0,
    ''
  );

  it('Ethereum address test', () => {
    const address = Ethereum(mnemonic).getAddress();
    expect(address).toEqual('0xC9330Ce433DfB0046efc7dD8aB1A8ACC433f37Aa');
  });

  it('Ethereum Classic address test', () => {
    const address = EthereumClassic(mnemonic).getAddress();
    expect(address).toEqual('0x73974c2e5F442969b443Aed9c31Df94d854584c3');
  });

  it('Bitcoin address test', () => {
    const address = Bitcoin(mnemonic).getAddress();
    expect(address).toEqual('1B7eaEtrFd2vzQDC2NcVXrbj8mCiTJDEAj');
  });

  it('BitcoinCash address test', () => {
    const address = BitcoinCash(mnemonic).getAddress();
    expect(address).toEqual('bitcoincash:qzdrr84qwasqzpnr53nkxdknlz8ykelugvg047625c');
  });

  it('Litecoin address test', () => {
    const address = Litecoin(mnemonic).getAddress();
    expect(address).toEqual('LMMN6Ybq87MhTf7YRfhapg33BWH53LkCgF');
  });

  it('Stellar address test', () => {
    const address = Stellar(mnemonic).getAddress();
    expect(address).toEqual('GC6WS24RVX5LIOVZEOH4FWQZAJVSF3AMFH37XU5K3XO7LTDLSMSVYA36');
  });

  it('Waves address test', () => {
    const address = Waves(mnemonic).getAddress();
    expect(address).toEqual('3P3kCK7VjQyRDVb4QGXxctp1jycxpdn5563');
  });
});
