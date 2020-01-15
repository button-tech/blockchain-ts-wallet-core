import { IBlockchain } from '../../typings/ts-wallet-core.dto';
import { EthereumUtils } from '../currenciesUtils/ethereum.utils';
import * as Currency from '../../DomainCurrency';

export function EthereumClassic(privateKey: string): IBlockchain {
  return new EthereumUtils(privateKey, Currency.EthereumClassic.Instance());
}
