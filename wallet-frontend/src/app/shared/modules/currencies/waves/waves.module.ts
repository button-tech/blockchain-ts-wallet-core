import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WavesRoutingModule} from './waves-routing.module';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from '../../../providers/node-api.provider';
import {WavesUtils} from './waves.utils';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { Waves } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Waves.Instance();
  const hdWallet = new HdWallet(opt.mnemonic, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new WavesUtils(keys.privateKey, keys.address, utils);
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
