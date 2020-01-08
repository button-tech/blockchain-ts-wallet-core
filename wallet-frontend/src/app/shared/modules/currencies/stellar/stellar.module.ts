import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StellarRoutingModule} from './stellar-routing.module';
import {StellarComponent} from './stellar.component';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from '../../../providers/node-api.provider';
import {StellarUtils} from './stellar.utils';
import { CurrencyFactoryOptions } from '../../../shared.module';
import { Stellar } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Stellar.Instance();
  const hdWallet = new HdWallet(opt.mnemonic, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new StellarUtils(keys.privateKey, keys.address, utils);
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
