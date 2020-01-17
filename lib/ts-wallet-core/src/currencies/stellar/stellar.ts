import { IAccount } from '../../typings/ts-wallet-core.dto';
import { StellarAccount } from '../currenciesUtils/stellar.account';

export function Stellar(privateKey: string): IAccount {
  return new StellarAccount(privateKey);
}
