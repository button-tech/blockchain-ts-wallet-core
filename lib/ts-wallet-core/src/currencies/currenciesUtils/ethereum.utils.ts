import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx';
import { privateToAddress } from 'ethereumjs-util';
import { Ethereum, EthereumClassic } from '../../DomainCurrency';
import { FromDecimal, Tbn } from '../../blockchain.utils';
import { EthereumTransactionParams, IBlockchain } from '../../typings/ts-wallet-core.dto';

export const EthereumDecimals = 18;

function decimalToHex(d: number | string): string {
  let hex = Tbn(d).toString(16);
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  return '0x' + hex;
}

export class EthereumUtils implements IBlockchain {


  constructor(private readonly privateKey: string, protected currency: Ethereum | EthereumClassic) {
  }

  getAddress(privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2);
    }
    if (privateKey.length !== 64) {
      throw new Error('Ethereum private key is invalid');
    }
    return '0x' + privateToAddress(new Buffer(privateKey, 'hex')).toString('hex');
  }

  signTransaction$(params: EthereumTransactionParams): Promise<string> {
    const value = FromDecimal(params.amount, EthereumDecimals).toNumber();
    const nonce = params.nonce;

    const txParam: TxData = {
      nonce: decimalToHex(nonce),
      gasPrice: decimalToHex(params.gasPrice),
      gasLimit: decimalToHex(params.gasLimit),
      to: params.toAddress,
      value: decimalToHex(value),
      data: params.data || '0x'
    };

    return Promise.resolve(this.sign(txParam, this.privateKey));
  }

  private sign(txParam: TxData, privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2);
    }
    const tx = new Transaction(txParam, this.getTransactionOptions());
    const privateKeyBuffer = new Buffer(privateKey, 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    return serializedTx.toString('hex');
  }

  private getTransactionOptions(): TransactionOptions {
    switch (this.currency.short) {
      case 'etc':
        return { hardfork: 'dao' };
      default:
        return { hardfork: 'petersburg' };
    }
  }

}
