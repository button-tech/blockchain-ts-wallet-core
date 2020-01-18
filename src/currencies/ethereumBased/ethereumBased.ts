import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx'
import { privateToAddress } from 'ethereumjs-util'
import { DecimalToHex, FromDecimal } from '../../blockchain.utils'
import { EthereumDecimals, EthereumTransactionParams, ICurrency } from '../../types'
import * as Currency from '../../DomainCurrency'

export function Ethereum(privateKey: string): ICurrency {
  return new EthereumBasedCurrency(privateKey, Currency.DomainEthereum.Instance())
}

export function EthereumClassic(privateKey: string): ICurrency {
  return new EthereumBasedCurrency(privateKey, Currency.DomainEthereumClassic.Instance())
}

export class EthereumBasedCurrency implements ICurrency {
  private readonly address: string

  constructor(
    private readonly privateKey: string,
    protected currency: Currency.DomainEthereum | Currency.DomainEthereumClassic
  ) {
    if (privateKey.indexOf('0x') === 0) {
      this.privateKey = privateKey.substring(2)
    }
    if (privateKey.length !== 64) {
      throw new Error('Ethereum private key is invalid')
    }
    this.address = '0x' + privateToAddress(new Buffer(privateKey, 'hex')).toString('hex')
  }

  getAddress(privateKey: string): string {
    return this.address
  }

  signTransaction(params: EthereumTransactionParams): Promise<string> {
    const value = FromDecimal(params.amount, EthereumDecimals).toNumber()
    const nonce = params.nonce

    const txParam: TxData = {
      nonce: DecimalToHex(nonce),
      gasPrice: DecimalToHex(params.gasPrice),
      gasLimit: DecimalToHex(params.gasLimit),
      to: params.toAddress,
      value: DecimalToHex(value),
      data: params.data || '0x'
    }

    return Promise.resolve(this.sign(txParam, this.privateKey))
  }

  private sign(txParam: TxData, privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2)
    }
    const tx = new Transaction(txParam, this.getTransactionOptions())
    const privateKeyBuffer = new Buffer(privateKey, 'hex')
    tx.sign(privateKeyBuffer)
    const serializedTx = tx.serialize()
    return serializedTx.toString('hex')
  }

  private getTransactionOptions(): TransactionOptions {
    switch (this.currency.short) {
      case 'etc':
        return { hardfork: 'dao' }
      default:
        return { hardfork: 'petersburg' }
    }
  }
}
