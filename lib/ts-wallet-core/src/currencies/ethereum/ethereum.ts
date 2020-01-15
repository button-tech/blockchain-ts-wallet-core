import { EthereumUtils } from '../currenciesUtils/ethereum.utils';
import * as Currency from '../../DomainCurrency';
import { IBlockchain } from '../../typings/ts-wallet-core.dto';

export function Ethereum(privateKey: string): IBlockchain {
  return new EthereumUtils(privateKey, Currency.Ethereum.Instance());
}
