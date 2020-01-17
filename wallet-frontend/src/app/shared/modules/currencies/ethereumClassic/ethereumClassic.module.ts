import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumClassicRoutingModule } from './ethereumClassic-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { EthereumClassic } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { getPrivateKey } from '../currencies.utils';
import { EthereumBasedService } from '../services/ethereumBased.service';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = EthereumClassic.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.EthereumClassic(privateKey);
  return new EthereumBasedService(privateKey, currency, blockchain, utils);
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
    EthereumClassicRoutingModule
  ]
})
export class EthereumClassicModule {
}
