import { map } from 'rxjs/operators';
import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx';
import { privateToAddress } from 'ethereumjs-util';
import { Observable } from 'rxjs';
import { Ethereum, EthereumClassic } from '../../DomainCurrency';
import { IBlockchainService, SignTransactionParams } from '../../shared.module';
import { NodeApiProvider } from '../../providers/node-api.provider';

export const EthereumDecimals = 18;

export class EthereumUtils implements IBlockchainService {


  constructor(private readonly privateKey: string,
              protected blockchainUtils: NodeApiProvider, protected currency: Ethereum | EthereumClassic) {
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

  getBalance$(address: string, guid: string): Observable<number> {
    return this.blockchainUtils.getBalance$(this.currency, address, guid)
      .pipe(map(x => {
        return +x;
      }));
  }

  async signTransaction$(params: SignTransactionParams, guid: string): Promise<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const value = this.blockchainUtils.toDecimal(params.amount, EthereumDecimals).toString();
    const nonce = !params.nonce ? await this.blockchainUtils.getNonce$(this.currency, fromAddress, guid).toPromise() : params.nonce;

    const feeObj = await this.blockchainUtils.getCustomFee$(this.currency, fromAddress, value, guid).toPromise();

    if (!feeObj.isEnough) {
      throw new Error('Not enough crypto for sending');
    }

    const txParam: TxData = {
      nonce: this.decimalToHex(nonce),
      gasPrice: this.decimalToHex(!params.gasPrice ? feeObj.gasPrice : params.gasPrice),
      gasLimit: this.decimalToHex(!params.gasLimit ? feeObj.gas : params.gasLimit),
      to: params.toAddress,
      value: this.decimalToHex(params.amount),
      data: params.data || '0x'
    };

    return this.sign(txParam, this.privateKey);
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.blockchainUtils.sendTx$(this.currency, rawTransaction, guid);
  }

  private sign(txParam: TxData, privateKey: string): string {
    if (privateKey.indexOf('0x') === 0) {
      privateKey = privateKey.substring(2);
    }

    const tx = new Transaction(txParam, this.getTransactionOptions());
    const privateKeyBuffer = (window as any).global.Buffer.from(privateKey, 'hex');
    tx.sign(privateKeyBuffer);
    const serializedTx = tx.serialize();
    return serializedTx.toString('hex');
  }

  private getTransactionOptions(): TransactionOptions {
    switch (this.currency.short) {
      case 'etc':
        return { hardfork: 'dao' };
      case 'eth':
        return { hardfork: 'petersburg' };
    }
  }

  decimalToHex(d: number | string): string {
    let hex = this.blockchainUtils.tbn(d).toString(16);
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    return '0x' + hex;
  }
}
