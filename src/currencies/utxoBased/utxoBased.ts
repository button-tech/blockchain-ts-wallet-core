import {
  ECPair,
  payments,
  TransactionBuilder,
  Network,
  Transaction,
  Signer,
  Payment
} from 'bitcoinjs-lib-cash';
import { toCashAddress, toLegacyAddress } from 'bchaddrjs';
import {
  currencyFactory,
  ICurrency,
  MnemonicDescriptor,
  UTXO,
  UtxoDecimals,
  UtxoTransactionParams
} from '../../types';
import { FromDecimal, Tbn } from '../../blockchain.utils';
import BigNumber from 'bignumber.js';
import { BitcoinCashConfig, BitcoinConfig, LitecoinConfig } from '../../networks';
import { getSecp256k1KeyPair } from '../../hd-wallet';
import { DomainBitcoin, DomainBitcoinCash, DomainLitecoin } from '../../DomainCurrency';

export const Bitcoin = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainBitcoin.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: UtxoBased
  })(secret);

export const BitcoinCash = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainBitcoinCash.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: UtxoBased
  })(secret);

export const Litecoin = (secret: string | MnemonicDescriptor): ICurrency =>
  currencyFactory({
    currency: DomainLitecoin.Instance(),
    getKeyPair: getSecp256k1KeyPair,
    instance: UtxoBased
  })(secret);

export class UtxoBased implements ICurrency {
  private readonly address: string;

  constructor(
    private readonly privateKey: string,
    private currency: DomainBitcoin | DomainBitcoinCash | DomainLitecoin
  ) {
    const keyPair: Signer = this.getKeyPair(privateKey);
    const payment: Payment = payments.p2pkh({
      pubkey: keyPair.publicKey,
      network: this.getNetwork()
    });
    if (!payment.address) {
      throw new Error('address not exists in ' + this.currency.full);
    }
    this.address = currency.short === 'bch' ? toCashAddress(payment.address) : payment.address;
  }

  getAddress(): string {
    return this.address;
  }

  signTransaction(params: UtxoTransactionParams): Promise<string> {
    let fromAddress = this.getAddress();

    const value = FromDecimal(params.amount, UtxoDecimals).toNumber();

    let hashType = Transaction.SIGHASH_ALL;
    if (this.currency.short === 'bch') {
      fromAddress = toLegacyAddress(fromAddress);
      params.toAddress = toLegacyAddress(params.toAddress);
      hashType = hashType | Transaction.SIGHASH_BITCOINCASHBIP143;
    }

    const utxos = params.inputs.sort(dynamicSort('-amount'));
    const tx = this.getTransactionBuilder();
    tx.setVersion(1);

    for (let i = 0; i < utxos.length; i++) {
      const currentInput = utxos[i];
      tx.addInput(
        currentInput.txid,
        currentInput.vout,
        currentInput.confirmations,
        Buffer.from(currentInput.scriptPubKey, 'hex')
      );
    }

    const inputsAmount = this.getInputsTotalAmount(params.inputs);
    const balanceWithoutFeeAndSendingAmount = Tbn(inputsAmount)
      .minus(value)
      .minus(params.fee)
      .toNumber();
    tx.addOutput(params.toAddress, value);
    if (balanceWithoutFeeAndSendingAmount > 0) {
      tx.addOutput(fromAddress, balanceWithoutFeeAndSendingAmount);
    }

    for (let i = 0; i < utxos.length; i++) {
      tx.sign(i, this.getPrivateKey(this.privateKey), undefined, hashType, utxos[i].satoshis);
    }

    return Promise.resolve(tx.build().toHex());
  }

  private getTransactionBuilder(): TransactionBuilder {
    const network = this.getNetwork();
    switch (this.currency.short) {
      case 'bch':
        return new TransactionBuilder(network, true);
      default:
        return new TransactionBuilder(network);
    }
  }

  private getKeyPair(privateKey: string, network?: Network): Signer {
    if (network) {
      const options: any = { network };
      return ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), options);
    }
    return ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
  }

  private getPrivateKey(privateKey: string): Signer {
    const network = this.getNetwork();
    return this.getKeyPair(privateKey, network);
  }

  private getNetwork(): Network {
    switch (this.currency.short) {
      case 'btc':
        return BitcoinConfig as Network;

      case 'bch':
        return BitcoinCashConfig as Network;

      case 'ltc':
        return LitecoinConfig as Network;

      default:
        throw new Error('config not exists in ' + this.currency.full);
    }
  }

  private getInputsTotalAmount(inputs: Array<UTXO>) {
    return inputs
      .map((x: UTXO): BigNumber => FromDecimal(x.amount, UtxoDecimals))
      .reduce((acc: BigNumber, n: BigNumber) => {
        return acc.plus(n);
      })
      .toNumber();
  }
}

function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a: any, b: any) => {
    const result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}
