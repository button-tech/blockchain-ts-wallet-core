import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcoinCashRoutingModule } from './bitcoinCash-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { getPrivateKey } from '../currencies.utils';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';
import { UtxoBasedService } from '../services/utxoBased.service';
import { BitcoinCash } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = BitcoinCash.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.BitcoinCash(privateKey);
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
    BitcoinCashRoutingModule
  ]
})
export class BitcoinCashModule {
}
