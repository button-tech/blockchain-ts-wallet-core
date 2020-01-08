import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IBlockchainService, SignTransactionParams } from '../../../send/send.module';
import { ECPair, payments, TransactionBuilder, Network, Transaction } from 'bitcoinjs-lib-cash';
import { Bitcoin, BitcoinCash, Litecoin } from '../../DomainCurrency';
import { NodeApiProvider } from '../../providers/node-api.provider';
import { toCashAddress } from 'bchaddrjs';

export const UtxoDecimals = 8;

export interface Keys {
  privateKey: any;
  fromAddress: string;
}

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

export class UtxoBasedUtils implements IBlockchainService {

  constructor(private blockchainUtils: NodeApiProvider, private currency: Bitcoin | BitcoinCash | Litecoin) {
  }

  getAddress(privateKey: string): string {
    const keypair = this.getKeyPair(privateKey);

    switch (this.currency.short) {
      case 'btc':
        return payments.p2pkh({ pubkey: keypair.publicKey }).address;

      case 'bch':
        return payments.p2pkh({ pubkey: keypair.publicKey, network: BitcoinCashConfig }).address;

      case 'ltc':
        return payments.p2pkh({ pubkey: keypair.publicKey, network: LitecoinConfig }).address;

    }
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return this.blockchainUtils.fromDecimal(x, UtxoDecimals).toNumber();
      }));
  }

  async signTransaction$(params: SignTransactionParams, guid: string): Promise<string> {
    const { privateKey, fromAddress } = this.getKeys(params.privateKey);
    const value = this.blockchainUtils.toDecimal(params.amount, UtxoDecimals).toString();

    const utxosAddress = this.currency.short === 'bch'
      ? toCashAddress(fromAddress)
      : fromAddress;
    const feeObj = await this.blockchainUtils.getCustomFee$(this.currency, utxosAddress, value, guid).toPromise();

    if (!feeObj.isEnough) {
      throw new Error('Not enough crypto for sending');
    }

    const utxos = (feeObj.inputs).sort(this.dynamicSort('-amount'));
    const tx = this.getTransactionBuilder();
    tx.setVersion(1);

    for (let i = 0; i < utxos.length; i++) {
      const currentInput = utxos[i];
      tx.addInput(currentInput.txid, currentInput.vout, currentInput.confirmations, new Buffer(currentInput.scriptPubKey, 'hex'));
    }

    const inputsAmount = this.getInputsTotalAmount(feeObj.inputs);
    const balanceWithoutFeeAndSendingAmount = this.blockchainUtils.tbn(inputsAmount)
      .minus(params.amount).minus(feeObj.fee).toNumber();
    tx.addOutput(params.toAddress, +params.amount);
    if (balanceWithoutFeeAndSendingAmount > 0) {
      tx.addOutput(fromAddress, balanceWithoutFeeAndSendingAmount);
    }

    for (let i = 0; i < utxos.length; i++) {
      tx.sign(0, privateKey, null, Transaction.SIGHASH_ALL | Transaction.SIGHASH_BITCOINCASHBIP143, utxos[i].satoshis);
    }

    return await tx.build().toHex();
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private getTransactionBuilder(): TransactionBuilder {
    switch (this.currency.short) {
      case 'btc':
        return new TransactionBuilder();
      case 'bch':
        return new TransactionBuilder(BitcoinCashConfig, true);
      case 'ltc':
        return new TransactionBuilder(LitecoinConfig);
    }
  }

  private getKeys(privateKey: string): Keys {
    const fromAddress = this.getAddress(privateKey);
    switch (this.currency.short) {
      case 'btc':
        return {
          privateKey: this.getKeyPair(privateKey),
          fromAddress
        };
      case 'bch':
        return {
          privateKey: this.getKeyPair(privateKey, BitcoinCashConfig),
          fromAddress
        };
      case 'ltc':
        return {
          privateKey: this.getKeyPair(privateKey, LitecoinConfig),
          fromAddress
        };
    }
  }

  private getKeyPair(privateKey: string, network?: Network): any {
    if (network) {
      const options: any = { network };
      return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'), options);
    }
    return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'));
  }

  private dynamicSort(property: string) {
    let sortOrder = 1;
    if (property[0] === '-') {
      sortOrder = -1;
      property = property.substr(1);
    }
    return (a, b) => {
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    };
  }

  private getInputsTotalAmount(inputs) {
    return inputs
      .map(x => this.blockchainUtils.fromDecimal(x.amount, UtxoDecimals))
      .reduce((acc, n) => {
        return this.blockchainUtils.tbn(acc).plus(n).toNumber();
      });
  }
}
