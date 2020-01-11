import { map, tap } from 'rxjs/operators';
import { Transaction, TransactionOptions, TxData } from 'ethereumjs-tx';
import { privateToAddress } from 'ethereumjs-util';
import { combineLatest, Observable, of } from 'rxjs';
import { Ethereum, EthereumClassic } from '../../DomainCurrency';
import { FromDecimal, IBlockchainService, SignTransactionParams, Tbn, ToDecimal } from '../../shared.module';
import { NodeApiProvider } from '../../providers/node-api.provider';
import { CustomFeeResponse } from '../../dto/node-api.dto';

export const EthereumDecimals = 18;

function decimalToHex(d: number | string): string {
  let hex = Tbn(d).toString(16);
  if (hex.length % 2 !== 0) {
    hex = '0' + hex;
  }
  return '0x' + hex;
}

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

  signTransaction$(params: SignTransactionParams, guid: string): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey);

    const decimalValue = ToDecimal(params.amount, EthereumDecimals).toString();
    const value = FromDecimal(params.amount, EthereumDecimals).toNumber();
    const nonce$ = !params.nonce
      ? this.blockchainUtils.getNonce$(this.currency, fromAddress, guid)
      : of(params.nonce);

    const feeObj$ = this.blockchainUtils.getCustomFee$(this.currency, fromAddress, decimalValue, guid).pipe(
      tap((feeObj) => {
        if (!feeObj.isEnough) {
          throw new Error('Not enough crypto for sending');
        }
      })
    );

    return combineLatest(nonce$, feeObj$).pipe(
      map(([nonce, feeObj]: [number, CustomFeeResponse]) => {
        const txParam: TxData = {
          nonce: decimalToHex(nonce),
          gasPrice: decimalToHex(!params.gasPrice ? feeObj.gasPrice : params.gasPrice),
          gasLimit: decimalToHex(!params.gasLimit ? feeObj.gas : params.gasLimit),
          to: params.toAddress,
          value: decimalToHex(value),
          data: params.data || '0x'
        };

        return this.sign(txParam, this.privateKey);
      })
    );
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

}
