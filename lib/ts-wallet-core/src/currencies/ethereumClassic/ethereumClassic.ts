import { IAccount } from '../../typings/ts-wallet-core.dto';
import { EthereumAccount } from '../currenciesUtils/ethereumBased.account';
import * as Currency from '../../DomainCurrency';

export function EthereumClassic(privateKey: string): IAccount {
  return new EthereumAccount(privateKey, Currency.EthereumClassic.Instance());
}
