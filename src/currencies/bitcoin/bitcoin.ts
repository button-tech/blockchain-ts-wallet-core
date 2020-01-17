import * as Currency from '../../DomainCurrency'
import { IAccount } from '../../types/ts-wallet-core.dto'
import { UtxoBasedAccount } from '../currenciesAccounts/utxoBased.account'

export function Bitcoin(privateKey: string): IAccount {
  return new UtxoBasedAccount(privateKey, Currency.Bitcoin.Instance())
}
