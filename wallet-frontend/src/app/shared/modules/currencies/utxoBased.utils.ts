import { from, Observable } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';
import { FromDecimal, IBlockchainService, SignTransactionParams, Tbn, ToDecimal } from '../../shared.module';
import { ECPair, payments, TransactionBuilder, Network, Transaction, Signer } from 'bitcoinjs-lib-cash';
import { Bitcoin, BitcoinCash, Litecoin } from '../../DomainCurrency';
import { NodeApiProvider } from '../../providers/node-api.provider';
import { toCashAddress, toLegacyAddress } from 'bchaddrjs';
import { EthereumDecimals } from './ethereum.utils';

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

function dynamicSort(property: string) {
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

export class UtxoBasedUtils implements IBlockchainService {

  constructor(private readonly privateKey: string,
              private nodeApiProvider: NodeApiProvider, private currency: Bitcoin | BitcoinCash | Litecoin) {
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
    return this.nodeApiProvider.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return FromDecimal(x, UtxoDecimals).toNumber();
      }));
  }

  signTransaction$(params: SignTransactionParams, guid: string): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const value = FromDecimal(params.amount, UtxoDecimals).toNumber();

    let utxosAddress = fromAddress;
    let hashType = Transaction.SIGHASH_ALL;
    if (this.currency.short === 'bch') {
      utxosAddress = toCashAddress(fromAddress);
      params.toAddress = toLegacyAddress(params.toAddress);
      hashType = hashType | Transaction.SIGHASH_BITCOINCASHBIP143;
    }
    return this.nodeApiProvider.getCustomFee$(this.currency, utxosAddress, params.amount, guid)
      .pipe(
        mergeMap(async (feeObj) => {
          if (!feeObj.isEnough) {
            throw new Error('Not enough crypto for sending');
          }

          const utxos = (feeObj.inputs).sort(dynamicSort('-amount'));
          const tx = this.getTransactionBuilder();
          tx.setVersion(1);

          for (let i = 0; i < utxos.length; i++) {
            const currentInput = utxos[i];
            tx.addInput(currentInput.txid, currentInput.vout, currentInput.confirmations, new Buffer(currentInput.scriptPubKey, 'hex'));
          }

          const inputsAmount = this.getInputsTotalAmount(feeObj.inputs);
          const balanceWithoutFeeAndSendingAmount = Tbn(inputsAmount)
            .minus(value).minus(feeObj.fee).toNumber();
          tx.addOutput(params.toAddress, value);
          if (balanceWithoutFeeAndSendingAmount > 0) {
            tx.addOutput(fromAddress, balanceWithoutFeeAndSendingAmount);
          }
          for (let i = 0; i < utxos.length; i++) {
            tx.sign(i, this.getPrivateKey(this.privateKey),
              null, hashType, utxos[i].satoshis);
          }

          return await tx.build().toHex();
        })
      );
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, rawTransaction, guid);
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

  private getPrivateKey(privateKey: string): Signer {
    switch (this.currency.short) {
      case 'btc':
        return this.getKeyPair(privateKey);
      case 'bch':
        return this.getKeyPair(privateKey, BitcoinCashConfig);
      case 'ltc':
        return this.getKeyPair(privateKey, LitecoinConfig);
    }
  }

  private getKeyPair(privateKey: string, network?: Network): Signer {
    if (network) {
      const options: any = { network };
      return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'), options);
    }
    return ECPair.fromPrivateKey(new Buffer(privateKey, 'hex'));
  }

  private getInputsTotalAmount(inputs) {
    return inputs
      .map(x => FromDecimal(x.amount, UtxoDecimals))
      .reduce((acc, n) => {
        return Tbn(acc).plus(n).toNumber();
      });
  }
}
