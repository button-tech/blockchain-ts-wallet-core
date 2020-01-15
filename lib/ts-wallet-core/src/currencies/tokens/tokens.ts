import { IBlockchain, IContract } from '../../typings/ts-wallet-core.dto';
import * as Currency from '../../DomainCurrency';
import { EthereumContractUtils } from '../currenciesUtils/ethereumContract.utils';

export function EthereumTokens(privateKey: string): IContract & IBlockchain {
  return new EthereumContractUtils(privateKey, Currency.Ethereum.Instance());
}
