import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {
  BackendResponse,
  CreateAccountRequest,
  ExchangeResponse, MoonPayResponse,
  OneInchExchangeResponse,
  TokenResponse,
  TransactionResponse, TxHashRequest
} from './dto/bot-backend.dto';
import { environment } from '../../environments/environment';


export class BotBackendService {

  constructor(private http: HttpClient) {}

  registerAccount$(req: CreateAccountRequest, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/create/${guid}`;
    return this.http.put(url, req)
      .pipe(
        map((x: BackendResponse<string>) => {
          return x.result;
        })
      );
  }

  sendQrCodeToEmail$(qrCode: Blob, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/sendToEmail/${guid}`;
    const formData = new FormData();
    formData.append('file', qrCode, 'BUTTONWallet.jpg');
    return this.http.post(url, formData)
      .pipe(map((x: string) => x));
  }

  getTransactionData$(guid: string): Observable<TransactionResponse> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<TransactionResponse>) => {
        return x.result;
      }));
  }

  getTokenData$(guid: string): Observable<TokenResponse> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<TokenResponse>) => {
        return x.result;
      }));
  }

  getExchangeData$(guid: string): Observable<ExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<ExchangeResponse>) => {
        return x.result;
      }));
  }

  getOneInchData$(guid: string): Observable<OneInchExchangeResponse> {
    const url = `${environment.backendUrl}/api/blockchain/swap/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<OneInchExchangeResponse>) => {
        return x.result;
      }));
  }

  getMoonpayData$(guid: string): Observable<MoonPayResponse> {
    const url = `${environment.backendUrl}/api/moonPay/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<MoonPayResponse>) => {
        return x.result;
      }));
  }

  sendTransactionData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/transaction/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put(url, body)
      .pipe(map((x: BackendResponse<string>) => {
        return x.result;
      }));
  }

  sendTokenData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/token/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put(url, body)
      .pipe(map((x: BackendResponse<string>) => {
        return x.result;
      }));
  }

  sendExchangeData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put(url, body)
      .pipe(map((x: BackendResponse<string>) => {
        return x.result;
      }));
  }

  sendOneInchData$(txHash: string, guid: string): Observable<string> {
    const url = `${environment.backendUrl}/api/blockchain/exchange/${guid}`;
    const body: TxHashRequest = { txHash };
    return this.http.put(url, body)
      .pipe(map((x: BackendResponse<string>) => {
        return x.result;
      }));
  }

  getExpiredDate$(guid: string): Observable<number> {
    const url = `${environment.backendUrl}/api/blockchain/validator/${guid}`;
    return this.http.get(url)
      .pipe(map((x: BackendResponse<string>) => {
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
}
