import { HttpClient } from '@angular/common/http';
import { map, retryWhen } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IDomainCurrency } from '../DomainCurrency';
import {
  BalanceResponse, CustomFeeRequest, CustomFeeResponse, GasLimitRequest, GasLimitResponse,
  GasPriceResponse,
  NonceResponse,
  SendRawTxRequest,
  SendRawTxResponse, UTXO, UTXOResponse,
  TonAccountInfo, TonAccountSeqno
} from '../dto/node-api.dto';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { delayedRetry } from './provider.utils';

@Injectable({
  providedIn: 'root'
})
export class NodeApiProvider {

  constructor(private http: HttpClient) {
  }

  sendTx$(currency: IDomainCurrency, data: string, guid: string): Observable<string> {
    const url = environment.nodeEndpoint + '/api/v1/send/' + guid;
    const body: SendRawTxRequest = {
      currency: currency.short,
      data
    };

    return this.http.post<SendRawTxResponse>(url, body).pipe(
      delayedRetry(1000),
      map(response => {
        return response.hash;
      }),
    );
  }

  getBalance$(currency: IDomainCurrency, address: string, guid: string): Observable<string> {
    const url = this.makeBalanceUrl(currency, address, guid);

    return this.http.get<BalanceResponse>(url).pipe(
      delayedRetry(1000),
      map(response => {
        return response.balance;
      })
    );
  }

  getNonce$(currency: IDomainCurrency, address: string, guid: string): Observable<number> {
    const url = `${environment.nodeEndpoint}/${currency.short}/nonce/${address}/${guid}`;

    return this.http.get<NonceResponse>(url).pipe(
      delayedRetry(1000),
      map(response => {
        return response.nonce;
      }),
    );
  }

  getGasPrice$(currency: IDomainCurrency, guid: string): Observable<number> {
    const url = `${environment.nodeEndpoint}/${currency.short}/gasPrice/${guid}`;

    return this.http.get<GasPriceResponse>(url).pipe(
      delayedRetry(1000),
      map(response => {
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

    return this.http.post<GasLimitResponse>(url, body).pipe(
      delayedRetry(1000),
      map(response => {
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

    return this.http.post<CustomFeeResponse>(url, body).pipe(
      delayedRetry(1000),
      map(response => {
        return response;
      }),
    );
  }

  getUtxo$(currency: IDomainCurrency, address: string, guid: string): Observable<Array<UTXO>> {
    const url = `${environment.nodeEndpoint}/${currency.short}/utxo/${address}/${guid}`;

    return this.http.get<UTXOResponse>(url).pipe(
      delayedRetry(1000),
      map(response => {
        return response.utxo;
      }),
    );
  }

  getTonAddressInfo$(address: string, guid: string): Observable<TonAccountInfo> {
    const url = `${environment.nodeEndpoint}/ton/getAccount/${address}/${guid}`;
    return this.http.get<TonAccountInfo>(url).pipe(
      delayedRetry(1000),
      map(response => {
        return response;
      }),
    );
  }

  getTonAccountSeqno$(address: string, guid: string): Observable<TonAccountSeqno> {
    const url = `${environment.nodeEndpoint}/ton/seqno/${address}/${guid}`;
    return this.http.get<TonAccountSeqno>(url).pipe(
      delayedRetry(1000),
      map(response => {
        return response.seqno;
      }),
    );
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
