import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WavesRoutingModule} from './waves-routing.module';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from '../../../providers/node-api.provider';
import {WavesUtils} from './waves.utils';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Bitcoin, Waves } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Waves.Instance();
  if (typeof opt.secret === 'string') {
    const hdWallet = new HdWallet(opt.secret, opt.password);
    const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
    return new WavesUtils(keys.privateKey, utils);
  } else if ((opt.secret as PrivateKeys).waves) {
    return new WavesUtils(opt.secret.waves, utils);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
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
