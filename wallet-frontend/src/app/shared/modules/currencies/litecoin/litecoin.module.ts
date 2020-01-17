import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitecoinRoutingModule } from './litecoin-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { Litecoin } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { getPrivateKey } from '../currencies.utils';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';
import { UtxoBasedService } from '../services/utxoBased.service';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Litecoin.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.Litecoin(privateKey);
  return new UtxoBasedService(privateKey, currency, blockchain, utils);
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
    LitecoinRoutingModule
  ]
})
export class LitecoinModule {
}
