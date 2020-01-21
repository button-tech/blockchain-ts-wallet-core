import { transfer, ITransferTransaction } from '@waves/waves-transactions';
import { address, privateKey, publicKey, TPrivateKey } from '@waves/ts-lib-crypto';
import { ICurrency, MnemonicDescriptor, WavesDecimals, WavesTransactionParams } from '../../types';
import { FromDecimal } from '../../blockchain.utils';
import { getEd25519KeyPair } from '../../hd-wallet';
import { Buffer } from 'buffer';
import * as basex from 'base-x';
import { DomainWaves } from '../../DomainCurrency';

export function Waves(secret: string | MnemonicDescriptor): ICurrency {
  if (secret instanceof MnemonicDescriptor) {
    const keyPair = getEd25519KeyPair(DomainWaves.Instance(), secret);
    return new WavesCurrency(keyPair.privateKey);
  }
  return new WavesCurrency(secret);
}

export class WavesCurrency implements ICurrency {
  private readonly secret: TPrivateKey;
  private readonly address: string;

  constructor(secret: string) {
    let privK: string;

    if (secret.split(' ').length > 2) {
      privK = privateKey(secret);
    } else {
      privK = basex('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz').encode(
        Buffer.from(secret, 'hex')
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
    const timestamp = params.timestamp || Date.now();
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
