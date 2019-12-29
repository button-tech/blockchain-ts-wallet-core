export interface BackendResponse<T> {
  error: string;
  result: T;
}

export interface CreateAccountRequest {
  bitcoinAddress: string;
  ethereumAddress: string;
  litecoinAddress: string;
  bitcoinCashAddress: string;
  wavesAddress: string;
  ethereumClassicAddress: string;
  stellarAddress: string;
  mail?: string;
}

export interface TransactionResponse {
  currency: string;
  from: string;
  to: string;
  nickname: string;
  fromNickName: string;
  value: string;
  valueInUsd: string;
  fromChatId: number;
  toChatId: number;
}

export interface TokenResponse {
  token: string;
  tokenAddress: string;
  from: string;
  to: string;
  nickname: string;
  value: string;
  valueInUsd: string;
  fromChatId: number;
  toChatId: number;
  fromNickName: string;
  decimals: number;
}

export interface ExchangeResponse {
  currency: string;
  isTokenTransfer: boolean;
  tokenAddress: string;
  decimals: number;
  changellyId: string;
  toAmount: number;
  fromAmount: number;
  toCurrency: string;
  fromCurrency: string;
  payingAddress: string;
  memo: string;
}

export interface TxHashRequest {
  txHash: string;
}

export interface OneInchExchangeResponse {
  txData: {
    from: string
    to: string
    gas: string
    gasPrice: string
    value: string
    data: string
  };
  tokenAddress: string;
  fromAmount: string;
  toAmount: string;
  fromCurrency: string;
  toCurrency: string;
  decimals: string;
}

export interface MoonPayResponse {
  currency: string;
  address: string;
}

