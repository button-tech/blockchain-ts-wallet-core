import { transfer } from 'waves-transactions'
import { ITransferTransaction } from 'waves-transactions/transactions'
import { address } from '@waves/ts-lib-crypto'
import { ICurrency, WavesDecimals, WavesTransactionParams } from '../../types'
import { FromDecimal } from '../../blockchain.utils'

export function Waves(privateKey: string): ICurrency {
  return new WavesCurrency(privateKey)
}

export class WavesCurrency implements ICurrency {
  constructor(private readonly privateKey: string) {}

  getAddress(privateKey: string): string {
    return address(privateKey)
  }

  signTransaction(params: WavesTransactionParams): Promise<string> {
    const timestamp = Date.now()
    const signedTx: ITransferTransaction = transfer(
      {
        amount: FromDecimal(params.amount, WavesDecimals).toNumber(),
        recipient: params.toAddress,
        timestamp
      },
      this.privateKey
    )

    return Promise.resolve(JSON.stringify(signedTx))
  }
}
