export interface BalanceResponse {
  balance: string;
}

export interface NonceResponse {
  nonce: number;
}

export interface GasLimitRequest {
  contractAddress: string;
  data: string;
}

export interface GasLimitResponse {
  gasLimit: number;
}

export interface GasPriceResponse {
  gasPrice: number;
}

export interface SendRawTxRequest {
  data: string;
  currency: string;
}

export interface SendRawTxResponse {
  hash: string;
}

export interface CustomFeeRequest {
  fromAddress: string;
  amount: string;
}

export interface CustomFeeResponse {
  fee: number;
  balance: number;
  maxAmountWithOptimalFee: number;
  maxAmount: number;
  isEnough: boolean;
  isBadFee: boolean;
  gasPrice?: number;
  gas?: number;
  input?: number;
  output?: number;
  feePerByte?: number;
  inputs?: Array<UTXO>;
}

export interface UTXO {
  address: string;
  txid: string;
  vout: number;
  scriptPubKey: string;
  amount: string;
  satoshis: number;
  height: number;
  confirmations: number;
  legacyAddress?: string;
  cashAddress?: string;
}

export interface UTXOResponse {
  utxo: Array<UTXO>;
}
