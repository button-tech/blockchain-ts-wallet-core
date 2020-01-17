import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx'
import { privateToAddress } from 'ethereumjs-util'
import { DecimalToHex, FromDecimal } from '../../blockchain.utils'
import { EthereumDecimals, EthereumTransactionParams, ICurrency } from '../../types'
import * as Currency from '../../DomainCurrency'

export function Ethereum(privateKey: string): ICurrency {
  return new EthereumBasedCurrency(privateKey, Currency.Ethereum.Instance())
}

export function EthereumClassic(privateKey: string): ICurrency {
  return new EthereumBasedCurrency(privateKey, Currency.EthereumClassic.Instance())
}

export class EthereumBasedCurrency implements ICurrency {
  constructor(
    private readonly privateKey: string,
    protected currency: Currency.Ethereum | Currency.EthereumClassic
  ) {}

  getAddress(privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2)
    }
    if (privateKey.length !== 64) {
      throw new Error('Ethereum private key is invalid')
    }
    return '0x' + privateToAddress(new Buffer(privateKey, 'hex')).toString('hex')
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
