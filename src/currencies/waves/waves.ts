import { transfer } from 'waves-transactions';
import { ITransferTransaction } from 'waves-transactions/transactions';
import { address, privateKey, publicKey } from '@waves/ts-lib-crypto';
import { ICurrency, MnemonicDescriptor, WavesDecimals, WavesTransactionParams } from '../../types';
import { FromDecimal } from '../../blockchain.utils';
import { getWavesKeyPair } from '../../hd-wallet';
import { Buffer } from 'buffer';
import * as basex from 'base-x';

export function Waves(secret: string | MnemonicDescriptor): ICurrency {
  if (secret instanceof MnemonicDescriptor) {
    const keyPair = getWavesKeyPair(secret.phrase, secret.index, secret.password);
    return new WavesCurrency(keyPair.privateKey);
  }
  return new WavesCurrency(secret);
}

interface IPrivateKey {
  privateKey: string;
}

export class WavesCurrency implements ICurrency {
  private readonly secret: IPrivateKey;
  private readonly address: string;

  constructor(secret: string) {
    let privK: string;

    if (secret.split(' ').length > 2) {
      privK = privateKey(secret);
    } else {
      privK = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(
        new Buffer(secret, 'hex')
      );
    }

    const pubK = publicKey({ privateKey: privK });
    this.address = address({ publicKey: pubK });
    this.secret = { privateKey: privK };
  }

  getAddress(): string {
    return this.address;
  }

  signTransaction(params: WavesTransactionParams): Promise<string> {
    const timestamp = Date.now();
    const signedTx: ITransferTransaction = transfer(
      // @ts-ignore
      {
        amount: FromDecimal(params.amount, WavesDecimals).toNumber(),
        recipient: params.toAddress,
        timestamp
      },
      this.secret
    );

    return Promise.resolve(JSON.stringify(signedTx));
  }
}
