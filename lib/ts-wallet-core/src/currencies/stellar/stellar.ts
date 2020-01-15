import { IBlockchain } from '../../typings/ts-wallet-core.dto';
import { StellarUtils } from '../currenciesUtils/stellar.utils';

export function Stellar(privateKey: string): IBlockchain {
  return new StellarUtils(privateKey);
}
