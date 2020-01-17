import { toCashAddress } from 'bchaddrjs'
import { Ethereum, EthereumClassic } from '../src/currencies/ethereumBased/ethereumBased'
import { Bitcoin, BitcoinCash, Litecoin } from '../src/currencies/utxoBased/utxoBased'
import { Stellar } from '../src/currencies/stellar/stellar'
import { Waves } from '../src/currencies/waves/waves'

describe('Addresses from private keys test', () => {
  it('Ethereum address test', () => {
    const privateKey = '0x61767b546ad545f954aef85fed6bbbe270ce2863403e5e74c1ca2c437aef0da8'
    const address = Ethereum(privateKey).getAddress(privateKey)
    expect(address).toEqual('0xd9e5efaebff27a5aaf6ed173a85709c6c21c3386')
  })

  it('Ethereum Classic address test', () => {
    const privateKey = '0xb8f418168a58e712e9f7512bf8eab4c8afcdcf464784bacadb8e4d4f2dfc005f'
    const address = EthereumClassic(privateKey).getAddress(privateKey)
    expect(address).toEqual('0x50aea0ed2cfdb7354d2f07f24c476f25e31cad5c')
  })

  it('Bitcoin address test', () => {
    const privateKey = '41c380a8af1d5ba164da7b1d224a3532c1f6c97bfe209dda6dedbe73eae3e5ea'
    const address = Bitcoin(privateKey).getAddress(privateKey)
    expect(address).toEqual('1JfNTQgPCyX1MBRXheh7tHfndyqzS1UMZX')
  })

  it('BitcoinCash address test', () => {
    const privateKey = '91485a3431fe3fb2772ed0765ab7ddb6fa5ee6fcfc4b2fc0dff991503e20d39e'
    const address = BitcoinCash(privateKey).getAddress(privateKey)
    expect(toCashAddress(address)).toEqual('bitcoincash:qz489et46v0rkajzy8drtd42w72hlm3cnykjhsqa08')
  })

  it('Litecoin address test', () => {
    const privateKey = '4551fdce10cbb2c25a51d6ddb826c1fbb195663c4e4609237e598ffadb439355'
    const address = Litecoin(privateKey).getAddress(privateKey)
    expect(address).toEqual('LbeUytCM2yz7cuQRsbUvpxuhH8cZxw24bw')
  })

  it('Stellar address test', () => {
    const privateKey = 'SCKH63JBZTZAUCZES5S4RRICUCWGRWADE3EXQZCYZVF66YJFEFWOGAHD'
    const address = Stellar(privateKey).getAddress(privateKey)
    expect(address).toEqual('GBT366KVNSQXAFVOXNZDJQJF2RHXVOSH7Y2MOGKOJZYAIGVDPVO5ITAY')
  })

  it('Waves address test', () => {
    const privateKey =
      'swift sign tired spare angle resource nice remind brief bench escape toss glare hawk middle'
    const address = Waves(privateKey).getAddress(privateKey)
    expect(address).toEqual('3P9NhNUvTe96Ex14SzccHYcYeGfMAwFnR4q')
  })
})
