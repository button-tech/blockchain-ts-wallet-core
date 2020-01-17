import { IAccount, IContract } from '../../types/ts-wallet-core.dto'
import * as Currency from '../../DomainCurrency'
import { EthereumContractAccount } from '../currenciesAccounts/ethereumBasedContract.account'

export function EthereumTokens(privateKey: string): IContract & IAccount {
  return new EthereumContractAccount(privateKey, Currency.Ethereum.Instance())
}
