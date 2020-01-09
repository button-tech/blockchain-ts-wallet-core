import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcoinCashRoutingModule } from './bitcoinCash-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { UtxoBasedUtils } from '../utxoBased.utils';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Bitcoin, BitcoinCash } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = BitcoinCash.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).bitcoinCash) {
    return handlePrivateKeysVersion(currency, utils, opt);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: BitcoinCash, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new UtxoBasedUtils(keys.privateKey, utils, currency);
}

function handlePrivateKeysVersion(currency: BitcoinCash, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new UtxoBasedUtils((opt.secret as PrivateKeys).bitcoinCash, utils, currency);
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
