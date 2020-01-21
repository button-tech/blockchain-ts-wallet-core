import { Ethereum, EthereumClassic } from '../src/currencies/ethereumBased';
import { Bitcoin, BitcoinCash, Litecoin } from '../src/currencies/utxoBased';
import { Stellar } from '../src/currencies/stellar';
import { Waves } from '../src/currencies/waves';
import { MnemonicDescriptor } from '../src';

describe('Addresses from private keys test', () => {
  const addressTest = [
    {
      currencyName: 'Ethereum',
      privateKey: '0x61767b546ad545f954aef85fed6bbbe270ce2863403e5e74c1ca2c437aef0da8',
      func: Ethereum,
      shouldBe: '0xd9E5EFAEBFf27a5aAF6eD173a85709c6C21c3386'
    },
    {
      currencyName: 'Ethereum Classic',
      privateKey: '0xb8f418168a58e712e9f7512bf8eab4c8afcdcf464784bacadb8e4d4f2dfc005f',
      func: EthereumClassic,
      shouldBe: '0x50aea0eD2CFdB7354D2F07F24c476F25e31cad5C'
    },
    {
      currencyName: 'Bitcoin',
      privateKey: '41c380a8af1d5ba164da7b1d224a3532c1f6c97bfe209dda6dedbe73eae3e5ea',
      func: Bitcoin,
      shouldBe: '1JfNTQgPCyX1MBRXheh7tHfndyqzS1UMZX'
    },
    {
      currencyName: 'BitcoinCash',
      privateKey: '91485a3431fe3fb2772ed0765ab7ddb6fa5ee6fcfc4b2fc0dff991503e20d39e',
      func: BitcoinCash,
      shouldBe: 'bitcoincash:qz489et46v0rkajzy8drtd42w72hlm3cnykjhsqa08'
    },
    {
      currencyName: 'Litecoin',
      privateKey: '4551fdce10cbb2c25a51d6ddb826c1fbb195663c4e4609237e598ffadb439355',
      func: Litecoin,
      shouldBe: 'LbeUytCM2yz7cuQRsbUvpxuhH8cZxw24bw'
    },
    {
      currencyName: 'Stellar',
      privateKey: 'SCKH63JBZTZAUCZES5S4RRICUCWGRWADE3EXQZCYZVF66YJFEFWOGAHD',
      func: Stellar,
      shouldBe: 'GBT366KVNSQXAFVOXNZDJQJF2RHXVOSH7Y2MOGKOJZYAIGVDPVO5ITAY'
    },
    {
      currencyName: 'Waves',
      privateKey: 'c0ca8a85df32da6c9bc652208b046d3e97c4c2f2daa14a5336b43dcd24227479',
      func: Waves,
      shouldBe: '3PDn2Sqwdz7Zbj6PJcNniRYKdLR3U3DJabR'
    }
  ];

  for (let test of addressTest) {
    it(`${test.currencyName} address test`, () => {
      const address = test.func(test.privateKey).getAddress();
      expect(address).toEqual(test.shouldBe);
    });
  }
});

describe('Addresses from mnemonic test', () => {
  const mnemonic = new MnemonicDescriptor(
    'control sock axis field icon jewel gown duck amateur type step save',
    0,
    ''
  );

  const addressTest = [
    {
      currencyName: 'Ethereum',
      func: Ethereum,
      shouldBe: '0xC9330Ce433DfB0046efc7dD8aB1A8ACC433f37Aa'
    },
    {
      currencyName: 'Ethereum Classic',
      func: EthereumClassic,
      shouldBe: '0x73974c2e5F442969b443Aed9c31Df94d854584c3'
    },
    {
      currencyName: 'Bitcoin',
      func: Bitcoin,
      shouldBe: '1B7eaEtrFd2vzQDC2NcVXrbj8mCiTJDEAj'
    },
    {
      currencyName: 'BitcoinCash',
      func: BitcoinCash,
      shouldBe: 'bitcoincash:qzdrr84qwasqzpnr53nkxdknlz8ykelugvg047625c'
    },
    {
      currencyName: 'Litecoin',
      func: Litecoin,
      shouldBe: 'LMMN6Ybq87MhTf7YRfhapg33BWH53LkCgF'
    },
    {
      currencyName: 'Stellar',
      func: Stellar,
      shouldBe: 'GC6WS24RVX5LIOVZEOH4FWQZAJVSF3AMFH37XU5K3XO7LTDLSMSVYA36'
    },
    {
      currencyName: 'Waves',
      func: Waves,
      shouldBe: '3P3kCK7VjQyRDVb4QGXxctp1jycxpdn5563'
    }
  ];

  for (let test of addressTest) {
    it(`${test.currencyName} address test`, () => {
      const address = test.func(mnemonic).getAddress();
      expect(address).toEqual(test.shouldBe);
    });
  }

  it('Waves address test from mnemonic phrase without derivation', () => {
    const address = Waves(mnemonic.phrase).getAddress();
    expect(address).toEqual('3PJopNv8bp7DLP2PHxRKJURDMWVguM8ZJZp');
  });
});
