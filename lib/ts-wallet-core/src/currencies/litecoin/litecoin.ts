import * as Currency from '../../DomainCurrency';
import { IAccount } from '../../typings/ts-wallet-core.dto';
import { UtxoBasedAccount } from '../currenciesUtils/utxoBased.account';

export function Litecoin(privateKey: string): IAccount {
  return new UtxoBasedAccount(privateKey, Currency.Litecoin.Instance());
}
