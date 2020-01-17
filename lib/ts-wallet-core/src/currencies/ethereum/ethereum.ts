import { EthereumAccount } from '../currenciesUtils/ethereumBased.account';
import * as Currency from '../../DomainCurrency';
import { IAccount } from '../../typings/ts-wallet-core.dto';

export function Ethereum(privateKey: string): IAccount {
  return new EthereumAccount(privateKey, Currency.Ethereum.Instance());
}
