import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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
    return this.http.put<BackendResponse<string>>(url, req)
      .pipe(
        map(x => {
          return this.handleResponse<string>(x);
        })
      );
  }

  sendQrCodeToEmail$(qrCode: Blob, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/sendToEmail/${guid}`;
    const formData = new FormData();
    formData.append('file', qrCode, 'BUTTONWallet.jpg');
    return this.http.post<string>(url, formData)
      .pipe(map((x) => x));
  }

  getTransactionData$(guid: string): Observable<TransactionResponse> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    return this.http.get<BackendResponse<TransactionResponse>>(url)
      .pipe(map(x => {
        return this.handleResponse<TransactionResponse>(x);
      }));
  }


  getTokenData$(guid: string): Observable<TokenResponse> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    return this.http.get<BackendResponse<TokenResponse>>(url)
      .pipe(map(x => {
        return this.handleResponse<TokenResponse>(x);
      }));
  }

  getExchangeData$(guid: string): Observable<ExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    return this.http.get<BackendResponse<ExchangeResponse>>(url)
      .pipe(map(x => {
        return this.handleResponse<ExchangeResponse>(x);
      }));
  }

  getOneInchData$(guid: string): Observable<OneInchExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/swap/${guid}`;
    return this.http.get<BackendResponse<OneInchExchangeResponse>>(url)
      .pipe(map(x => {
        return this.handleResponse<OneInchExchangeResponse>(x);
      }));
  }

  getMoonpayData$(guid: string): Observable<MoonPayResponse> {
    const url = `${environment.backendUrl}/api/moonPay/${guid}`;
    return this.http.get<BackendResponse<MoonPayResponse>>(url)
      .pipe(map(x => {
        return this.handleResponse<MoonPayResponse>(x);
      }));
  }

  sendTransactionData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put<BackendResponse<string>>(url, body)
      .pipe(map(x => {
        return this.handleResponse<string>(x);
      }));
  }

  sendTokenData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put<BackendResponse<string>>(url, body)
      .pipe(map(x => {
        return this.handleResponse<string>(x);
      }));
  }

  sendExchangeData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put<BackendResponse<string>>(url, body)
      .pipe(map(x => {
        return this.handleResponse<string>(x);
      }));
  }

  sendOneInchData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put<BackendResponse<string>>(url, body)
      .pipe(map(x => {
        return this.handleResponse<string>(x);
      }));
  }

  getExpiredDate$(guid: string): Observable<number> {
    const url = `${environment.backendUrl}/api/blockchain/validator/${guid}`;
    return this.http.get<BackendResponse<string>>(url)
      .pipe(map(x => {
        if (x.error) {
          return throwError('transaction with this identifier doesn\'t exist');
        }
        const deleteDate = new Date(x.result).getTime();
        const now = Date.now();
        const difference = Number(deleteDate) - now;
        if (difference <= 0) {
          return 0;
        }

        const differenceInMinute = difference / 1000 / 60;
        return 60 * differenceInMinute;
      }));
  }

  private handleResponse<T>(response: BackendResponse): T | Error {
    if (response.error) {
      return throwError('transaction with this identifier doesn\'t exist');
    }
    return response.result;
  }
}

