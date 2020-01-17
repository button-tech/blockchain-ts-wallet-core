import { IAccount, IContract } from '../../typings/ts-wallet-core.dto';
import * as Currency from '../../DomainCurrency';
import { EthereumContractAccount } from '../currenciesUtils/ethereumBasedContract.account';

export function EthereumTokens(privateKey: string): IContract & IAccount {
  return new EthereumContractAccount(privateKey, Currency.Ethereum.Instance());
}
