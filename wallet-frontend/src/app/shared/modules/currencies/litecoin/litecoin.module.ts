import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitecoinRoutingModule } from './litecoin-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { UtxoBasedUtils } from '../utxoBased.utils';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Litecoin } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Litecoin.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).Litecoin) {
    return handlePrivateKeysVersion(currency, utils, opt);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: Litecoin, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new UtxoBasedUtils(keys.privateKey, utils, currency);
}

function handlePrivateKeysVersion(currency: Litecoin, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new UtxoBasedUtils((opt.secret as PrivateKeys).Litecoin, utils, currency);
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
