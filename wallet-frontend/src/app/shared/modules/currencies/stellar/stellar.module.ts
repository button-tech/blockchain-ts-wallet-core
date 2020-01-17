import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StellarRoutingModule } from './stellar-routing.module';
import { StellarComponent } from './stellar.component';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions } from '../../../shared.module';
import { Stellar } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import { getPrivateKey } from '../currencies.utils';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';
import { StellarService } from '../services/stellar.service';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Stellar.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.Stellar(privateKey);
  return new StellarService(privateKey, currency, blockchain, utils);
}

@NgModule({
  declarations: [StellarComponent],
  imports: [
    SendModule.forChild({
      init
    }),
    CommonModule,
    StellarRoutingModule,
  ],
  providers: []
})
export class StellarModule {
}
