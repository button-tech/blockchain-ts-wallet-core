import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BigNumber } from 'bignumber.js';
import { IDomainCurrency } from './DomainCurrency';
import {
  BalanceResponse, CustomFeeRequest, CustomFeeResponse, GasLimitRequest, GasLimitResponse,
  GasPriceResponse,
  NonceResponse,
  SendRawTxRequest,
  SendRawTxResponse, UTXO, UTXOResponse
} from './dto/blockchainUtils.dto';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BlockchainUtilsService {

  constructor(private http: HttpClient) {
  }

  sendTx$(currency: IDomainCurrency, data: string, guid: string): Observable<string> {
    const url = environment.nodeEndpoint + '/api/v1/send/' + guid;
    const body: SendRawTxRequest = {
      currency: currency.short,
      data
    };

    return this.http.post(url, body).pipe(
      map((response: SendRawTxResponse) => {
        return response.hash;
      }),
    );
  }

  getBalance$(currency: IDomainCurrency, address: string, guid: string): Observable<string> {
    const url = this.makeBalanceUrl(currency, address, guid);

    return this.http.get(url).pipe(
      map((response: BalanceResponse) => {
        return response.balance;
      }),
    );
  }

  getNonce$(currency: IDomainCurrency, address: string, guid: string): Observable<number> {
    const url = `${environment.nodeEndpoint}/${currency.short}/nonce/${address}/${guid}`;

    return this.http.get(url).pipe(
      map((response: NonceResponse) => {
        return response.nonce;
      }),
    );
  }

  getGasPrice$(currency: IDomainCurrency, guid: string): Observable<number> {
    const url = `${environment.nodeEndpoint}/${currency.short}/gasPrice/${guid}`;

    return this.http.get(url).pipe(
      map((response: GasPriceResponse) => {
        return response.gasPrice;
      }),
    );
  }

  getGasLimit$(currency: IDomainCurrency, contractAddress: string, data: string, guid: string): Observable<number> {
    const url = `${environment.nodeEndpoint}/${currency.short}/estimateGas/${guid}`;
    const body: GasLimitRequest = {
      contractAddress,
      data
    };

    return this.http.post(url, body).pipe(
      map((response: GasLimitResponse) => {
        return response.gasLimit;
      }),
    );
  }

  getCustomFee$(currency: IDomainCurrency, fromAddress: string, amount: string, guid: string): Observable<CustomFeeResponse> {
    const url = `${environment.nodeEndpoint}/fee/${currency.full}/${guid}`;
    const body: CustomFeeRequest = {
      fromAddress,
      amount
    };

    return this.http.post(url, body).pipe(
      map((response: CustomFeeResponse) => {
        return response;
      }),
    );
  }

  getUtxo$(currency: IDomainCurrency, address: string, guid: string): Observable<Array<UTXO>> {
    const url = `${environment.nodeEndpoint}/${currency.short}/utxo/${address}/${guid}`;

    return this.http.get(url).pipe(
      map((response: UTXOResponse) => {
        return response.utxo;
      }),
    );
  }

  tbn = (x: string | number): BigNumber => new BigNumber(x);

  fromDecimal(x: string | number | BigNumber, n: number): BigNumber {
    return BigNumber.isBigNumber(x) ? x.times(10 ** n).integerValue() : this.tbn(x).times(10 ** n).integerValue();
  }

  toDecimal(x: string | number | BigNumber, n: number): BigNumber {
    return BigNumber.isBigNumber(x) ? x.div(10 ** n) : this.tbn(x).div(10 ** n);
  }

  private makeBalanceUrl(currency: IDomainCurrency, address: string, guid: string): string {
    switch (currency.short) {
      case 'waves':
        return 'https://nodes.wavesnodes.com/addresses/balance/' + address + '/0';
      default:
        return `${environment.nodeEndpoint}/${currency.short}/balance/${address}/${guid}`;
    }
  }
}
