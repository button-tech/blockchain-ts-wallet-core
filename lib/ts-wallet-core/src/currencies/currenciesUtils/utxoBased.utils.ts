import { ECPair, payments, TransactionBuilder, Network, Transaction, Signer, Payment } from 'bitcoinjs-lib-cash';
import { toLegacyAddress } from 'bchaddrjs';
import { Bitcoin, BitcoinCash, Litecoin } from '../../DomainCurrency';
import { IBlockchain, UTXO, UtxoTransactionParams } from '../../typings/ts-wallet-core.dto';
import { FromDecimal, Tbn } from '../../blockchain.utils';
import BigNumber from 'bignumber.js';

export const UtxoDecimals = 8;

const LitecoinConfig: Network = {
  messagePrefix: '\x19Litecoin Signed Message:\n',
  bech32: 'ltc',
  bip32: {
    public: 0x019da462,
    private: 0x019d9cfe,
  },
  pubKeyHash: 0x30,
  scriptHash: 0x32,
  wif: 0xb0,
};

// https://github.com/cryptocoinjs/coininfo/blob/master/lib/coins/bch.js
const BitcoinCashConfig: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bitcoincash:q',
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

const BitcoinConfig: Network = {
  messagePrefix: '\x18Bitcoin Signed Message:\n',
  bech32: 'bc',
  bip32: {
    private: 0x0488ade4,
    public: 0x0488b21e
  },
  pubKeyHash: 0x00,
  scriptHash: 0x05,
  wif: 0x80,
};

function dynamicSort(property: string) {
  let sortOrder = 1;
  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }
  return (a: any, b: any) => {
    const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
    return result * sortOrder;
  };
}

export class UtxoBasedUtils implements IBlockchain {

  constructor(private readonly privateKey: string, private currency: Bitcoin | BitcoinCash | Litecoin) {
  }

  getAddress(privateKey: string): string {
    const keypair: Signer = this.getKeyPair(privateKey);
    const payment: Payment = payments.p2pkh({ pubkey: keypair.publicKey, network: this.getNetwork() });
    if (!payment.address) {
      throw new Error('address not exists in ' + this.currency.full);
    }
    return payment.address;
  }

  signTransaction$(params: UtxoTransactionParams): Promise<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const value = FromDecimal(params.amount, UtxoDecimals).toNumber();

    let hashType = Transaction.SIGHASH_ALL;
    if (this.currency.short === 'bch') {
      params.toAddress = toLegacyAddress(params.toAddress);
      hashType = hashType | Transaction.SIGHASH_BITCOINCASHBIP143;
    }

    const utxos = (params.inputs).sort(dynamicSort('-amount'));
    const tx = this.getTransactionBuilder();
    tx.setVersion(1);

    for (let i = 0; i < utxos.length; i++) {
      const currentInput = utxos[i];
      tx.addInput(currentInput.txid, currentInput.vout, currentInput.confirmations, new Buffer(currentInput.scriptPubKey, 'hex'));
    }

    const inputsAmount = this.getInputsTotalAmount(params.inputs);
    const balanceWithoutFeeAndSendingAmount = Tbn(inputsAmount)
      .minus(value).minus(params.fee).toNumber();
    tx.addOutput(params.toAddress, value);
    if (balanceWithoutFeeAndSendingAmount > 0) {
      tx.addOutput(fromAddress, balanceWithoutFeeAndSendingAmount);
    }

    for (let i = 0; i < utxos.length; i++) {
      tx.sign(i, this.getPrivateKey(this.privateKey),
        undefined, hashType, utxos[i].satoshis);
    }


    return Promise.resolve(tx.build().toHex());
  }

  private getTransactionBuilder(): TransactionBuilder {
    switch (this.currency.short) {
      case 'btc':
        return new TransactionBuilder();
      case 'bch':
        return new TransactionBuilder(BitcoinCashConfig, true);
      case 'ltc':
        return new TransactionBuilder(LitecoinConfig);
      default:
        throw new Error('transaction builder not exists in ' + this.currency.full);
    }
  }

  private getKeyPair(privateKey: string, network?: Network): Signer {
    if (network) {
      const options: any = { network };
      return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'), options);
    }
    return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'));
  }

  private getPrivateKey(privateKey: string): Signer {
    switch (this.currency.short) {
      case 'btc':
        return this.getKeyPair(privateKey);
      case 'bch':
        return this.getKeyPair(privateKey, BitcoinCashConfig);
      case 'ltc':
        return this.getKeyPair(privateKey, LitecoinConfig);
      default:
        throw new Error('key pair not exists in ' + this.currency.full);
    }
  }

  private getNetwork(): Network {
    switch (this.currency.short) {
      case 'btc':
        return BitcoinConfig;

      case 'bch':
        return BitcoinCashConfig;

      case 'ltc':
        return LitecoinConfig;

      default:
        throw new Error('config not exists in ' + this.currency.full);
    }
  }

  private getInputsTotalAmount(inputs: Array<UTXO>) {
    return inputs
      .map((x: UTXO): BigNumber => FromDecimal(x.amount, UtxoDecimals))
      .reduce((acc: BigNumber, n: BigNumber) => {
        return acc.plus(n);
      }).toNumber();
  }
}
