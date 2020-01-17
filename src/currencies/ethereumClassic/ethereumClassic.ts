import { IAccount } from '../../types/ts-wallet-core.dto'
import { EthereumAccount } from '../currenciesAccounts/ethereumBased.account'
import * as Currency from '../../DomainCurrency'

export function EthereumClassic(privateKey: string): IAccount {
  return new EthereumAccount(privateKey, Currency.EthereumClassic.Instance())
}
