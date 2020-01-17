import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcoinRoutingModule } from './bitcoin-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { UtxoBasedService } from '../services/utxoBased.service';
import { getPrivateKey } from '../currencies.utils';
import { Bitcoin } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Bitcoin.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.Bitcoin(privateKey);
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
    BitcoinRoutingModule
  ]
})
export class BitcoinModule {
}
