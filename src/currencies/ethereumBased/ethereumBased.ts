import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx';
import { privateToAddress, toChecksumAddress } from 'ethereumjs-util';
import { DecimalToHex, FromDecimal } from '../../blockchain.utils';
import {
  currencyFactory,
  EthereumDecimals,
  EthereumTransactionParams,
  ICurrency,
  MnemonicDescriptor
} from '../../types';
import { getSecp256k1KeyPair } from '../../hd-wallet';
import { DomainEthereum, DomainEthereumClassic, DomainPOA } from '../../DomainCurrency';

export const Ethereum = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainEthereum.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: EthereumBasedCurrency
  })(secret);

export const EthereumClassic = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainEthereumClassic.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: EthereumBasedCurrency
  })(secret);

export const PoaNetwork = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainPOA.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: EthereumBasedCurrency
  })(secret);

export class EthereumBasedCurrency implements ICurrency {
  private readonly address: string;

  constructor(
    private readonly privateKey: string,
    protected currency: DomainEthereum | DomainEthereumClassic
  ) {
    if (this.privateKey.indexOf('0x') === 0) {
      this.privateKey = privateKey.substring(2);
    }
    if (this.privateKey.length !== 64) {
      throw new Error('Ethereum private key is invalid');
    }
    this.address = toChecksumAddress(
      privateToAddress(Buffer.from(this.privateKey, 'hex')).toString('hex')
    );
  }

  getAddress(): string {
    return this.address;
  }

  signTransaction(params: EthereumTransactionParams): Promise<string> {
    const value = FromDecimal(params.amount, EthereumDecimals).toNumber();
    const nonce = params.nonce;

    const txParam: TxData = {
      nonce: DecimalToHex(nonce),
      gasPrice: DecimalToHex(params.gasPrice),
      gasLimit: DecimalToHex(params.gasLimit),
      to: params.toAddress,
      value: DecimalToHex(value),
      data: params.data || '0x'
    };

    return Promise.resolve(this.sign(txParam, this.privateKey));
  }

  private sign(txParam: TxData, privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2);
    }
    const tx = new Transaction(txParam, this.getTransactionOptions());
    const privateKeyBuffer = Buffer.from(privateKey, 'hex');
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
