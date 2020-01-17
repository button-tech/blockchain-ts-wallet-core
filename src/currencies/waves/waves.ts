import { IAccount } from '../../types/ts-wallet-core.dto'
import { WavesAccount } from '../currenciesAccounts/waves.account'

export function Waves(privateKey: string): IAccount {
  return new WavesAccount(privateKey)
}
