import { IBlockchain } from '../../typings/ts-wallet-core.dto';
import { WavesUtils } from '../currenciesUtils/waves.utils';

export function Waves(privateKey: string): IBlockchain {
  return new WavesUtils(privateKey);
}
