import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumRoutingModule } from './ethereum-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Ethereum } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';
import { EthereumUtils } from '../ethereum.utils';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Ethereum.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).ethereum) {
    return handlePrivateKeysVersion(currency, utils, opt);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: Ethereum, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new EthereumUtils(keys.privateKey, utils, currency);
}

function handlePrivateKeysVersion(currency: Ethereum, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new EthereumUtils((opt.secret as PrivateKeys).ethereum, utils, currency);
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
    EthereumRoutingModule
  ]
})
export class EthereumModule {
}
