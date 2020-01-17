import { IAccount } from '../../typings/ts-wallet-core.dto';
import { WavesAccount } from '../currenciesUtils/waves.account';

export function Waves(privateKey: string): IAccount {
  return new WavesAccount(privateKey);
}
