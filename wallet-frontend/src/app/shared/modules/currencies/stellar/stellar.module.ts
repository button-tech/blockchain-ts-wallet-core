import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StellarRoutingModule } from './stellar-routing.module';
import { StellarComponent } from './stellar.component';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { StellarUtils } from './stellar.utils';
import { CurrencyFactoryOptions, PrivateKeys } from '../../../shared.module';
import { Stellar } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Stellar.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).stellar) {
    return handlePrivateKeysVersion(utils, opt);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: Stellar, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new StellarUtils(keys.privateKey, utils);
}

function handlePrivateKeysVersion(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new StellarUtils((opt.secret as PrivateKeys).stellar, utils);
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
