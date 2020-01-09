import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WavesRoutingModule} from './waves-routing.module';
import {SendModule} from '../../../../send/send.module';
import {NodeApiProvider} from '../../../providers/node-api.provider';
import {WavesUtils} from './waves.utils';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Bitcoin, Ethereum, Waves } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Waves.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).waves) {
    return handlePrivateKeysVersion(utils, opt);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: Waves, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new WavesUtils(keys.privateKey, utils);
}

function handlePrivateKeysVersion(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new WavesUtils((opt.secret as PrivateKeys).waves, utils);
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
