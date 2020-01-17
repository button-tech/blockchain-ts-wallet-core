import { IAccount } from '../../types/ts-wallet-core.dto'
import { StellarAccount } from '../currenciesAccounts/stellar.account'

export function Stellar(privateKey: string): IAccount {
  return new StellarAccount(privateKey)
}
