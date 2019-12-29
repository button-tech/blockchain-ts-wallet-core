import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignTransactionParams } from 'send.module';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SendService {

  constructor(private http: HttpClient) {
  }

  // getAddress(privateKey: string): string;
  //
  // getBalance$(address: string, guid: string): Observable<number>;
  //
  // signTransaction$(params: SignTransactionParams, guid?: string): string;
  //
  // sendTransaction$(rawTransaction: string, guid: string): Promise<string>;
}
