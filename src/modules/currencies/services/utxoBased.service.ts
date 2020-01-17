import { Observable } from 'rxjs'
import { map, mergeMap } from 'rxjs/operators'
import {
  IAccount,
  UtxoTransactionParams
} from '../../../../../../../lib/ts-wallet-core/src/typings/ts-wallet-core.dto'
import { UtxoDecimals } from '../../../../../../../lib/ts-wallet-core/src/currencies/currenciesUtils/utxoBased.account'
import { IBlockchainService } from '../../../shared.module'
import { IDomainCurrency } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency'
import { INodeApiProvider } from '../../../providers/node-api.provider'
import { FromDecimal } from '../../../../../../../lib/ts-wallet-core/src/blockchain.utils'
import { toCashAddress } from 'bchaddrjs'

export class UtxoBasedService implements IBlockchainService {
  constructor(
    private privateKey: string,
    private currency: IDomainCurrency,
    private account: IAccount,
    private nodeApiProvider: INodeApiProvider
  ) {}

  getAddress(privateKey: string): string {
    return this.account.getAddress(privateKey)
  }

  getBalance$(address: string, guid: string): Observable<number> {
    return this.nodeApiProvider.getBalance$(this.currency, address, guid).pipe(
      map(x => {
        return FromDecimal(x, UtxoDecimals).toNumber()
      })
    )
  }

  signTransaction$(params: UtxoTransactionParams, guid: string): Observable<string> {
    const fromAddress = this.getAddress(this.privateKey)
    let utxoAddress = fromAddress
    if (this.currency.short === 'bch') {
      utxoAddress = toCashAddress(fromAddress)
    }
    return this.nodeApiProvider.getCustomFee$(this.currency, utxoAddress, params.amount, guid).pipe(
      mergeMap(feeObj => {
        params.fee = feeObj.fee
        params.inputs = feeObj.inputs
        return this.account.signTransaction$(params)
      })
    )
  }

  sendTransaction$(rawTransaction: string, guid: string): Observable<string> {
    return this.nodeApiProvider.sendTx$(this.currency, rawTransaction, guid)
  }
}
