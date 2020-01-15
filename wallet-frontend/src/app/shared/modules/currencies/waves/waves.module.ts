import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WavesRoutingModule } from './waves-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { getPrivateKey } from '../currencies.utils';
import TsWalletCore from '../../../../../../../lib/ts-wallet-core/src/ts-wallet-core';
import { Waves } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { WavesService } from '../services/waves.service';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Waves.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = TsWalletCore.Waves(privateKey);
  return new WavesService(privateKey, currency, blockchain, utils);
}

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SendModule.forChild({
        init
      },
    ),
    CommonModule,
    WavesRoutingModule
  ]
})
export class WavesModule {
}
