import { transfer } from 'waves-transactions';
import { ITransferTransaction } from 'waves-transactions/transactions';
import { address } from '@waves/ts-lib-crypto';
import { ICurrency, Mnemonic, WavesDecimals, WavesTransactionParams } from '../../types';
import { FromDecimal } from '../../blockchain.utils';
import { getWavesKeyPair } from '../../hd-wallet';
import { Buffer } from 'buffer';
import { box } from 'tweetnacl';

export function Waves(secret: string | Mnemonic): ICurrency {
  if (secret instanceof Mnemonic) {
    const keyPair = getWavesKeyPair(secret.phrase, secret.index, secret.password);
    return new WavesCurrency(keyPair.privateKey);
  }
  return new WavesCurrency(secret);
}

export class WavesCurrency implements ICurrency {
  private readonly address: string;

  constructor(private readonly privateKey: string) {
    const publicKey = new Buffer(box.keyPair.fromSecretKey(new Buffer(privateKey)).publicKey);
    this.address = address(publicKey);
  }

  getAddress(privateKey: string): string {
    return this.address;
  }

  signTransaction(params: WavesTransactionParams): Promise<string> {
    const timestamp = Date.now();
    const signedTx: ITransferTransaction = transfer(
      {
        amount: FromDecimal(params.amount, WavesDecimals).toNumber(),
        recipient: params.toAddress,
        timestamp
      },
      this.privateKey
    );

    return Promise.resolve(JSON.stringify(signedTx));
  }
}
