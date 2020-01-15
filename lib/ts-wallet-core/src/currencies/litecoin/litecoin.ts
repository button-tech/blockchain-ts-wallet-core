import * as Currency from '../../DomainCurrency';
import { IBlockchain } from '../../typings/ts-wallet-core.dto';
import { UtxoBasedUtils } from '../currenciesUtils/utxoBased.utils';

export function Litecoin(privateKey: string): IBlockchain {
  return new UtxoBasedUtils(privateKey, Currency.Litecoin.Instance());
}
