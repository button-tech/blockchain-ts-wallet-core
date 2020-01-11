import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import {
  BackendResponse,
  CreateAccountRequest,
  ExchangeResponse, MoonPayResponse,
  OneInchExchangeResponse,
  TokenResponse,
  TransactionResponse, TxHashRequest
} from '../dto/bot-backend.dto';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BotBackendProvider {

  constructor(private http: HttpClient) {
  }

  registerAccount$(req: CreateAccountRequest, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/create/${guid}`;
    return this.put<string>(url, req);
  }

  sendQrCodeToEmail$(qrCode: Blob, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/sendToEmail/${guid}`;
    const formData = new FormData();
    formData.append('file', qrCode, 'BUTTONWallet.jpg');
    return this.http.post<string>(url, formData);
  }

  getTransactionData$(guid: string): Observable<TransactionResponse> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    return this.get<TransactionResponse>(url);
  }


  getTokenData$(guid: string): Observable<TokenResponse> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    return this.get<TokenResponse>(url);
  }

  getExchangeData$(guid: string): Observable<ExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    return this.get<ExchangeResponse>(url);
  }

  getOneInchData$(guid: string): Observable<OneInchExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/swap/${guid}`;
    return this.get<OneInchExchangeResponse>(url);
  }

  getMoonpayData$(guid: string): Observable<MoonPayResponse> {
    const url = `${environment.backendUrl}/api/moonPay/${guid}`;
    return this.get<MoonPayResponse>(url);
  }

  sendTransactionData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.put<string>(url, body);
  }

  sendTokenData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.put<string>(url, body);
  }

  sendExchangeData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.put<string>(url, body);
  }

  sendOneInchData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put<BackendResponse<string>>(url, body)
      .pipe(map(x => {
        if (x.error) {
          throw new Error('transaction with this identifier doesn\'t exist');
        }
        return x.result;
      }));
  }

  getExpiredDate$(guid: string): Observable<number> {
    const url = `${environment.backendUrl}/api/blockchain/validator/${guid}`;
    return this.get<string>(url)
      .pipe(map(x => {
        const deleteDate = new Date(x).getTime();
        const now = Date.now();
        const difference = Number(deleteDate) - now;
        if (difference <= 0) {
          return 0;
        }

        const differenceInMinute = difference / 1000 / 60;
        return 60 * differenceInMinute;
      }));
  }

  private get<T>(url: string): Observable<T> {
    return this.http.get<BackendResponse<T>>(url)
      .pipe(
        map(x => {
          if (x.error) {
            throw new Error('transaction with this identifier doesn\'t exist');
          }
          return x.result;
        })
      );
  }

  private put<T>(url: string, body: any): Observable<T> {
    return this.http.put<BackendResponse<T>>(url, body)
      .pipe(
        map(x => {
          if (x.error) {
            throw new Error('transaction with this identifier doesn\'t exist');
          }
          return x.result;
        })
      );
  }
}

