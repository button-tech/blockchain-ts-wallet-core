import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumClassicRoutingModule } from './ethereumClassic-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Bitcoin, EthereumClassic } from '../../../DomainCurrency';
import { EthereumUtils } from '../ethereum.utils';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';
import { UtxoBasedUtils } from '../utxoBased.utils';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = EthereumClassic.Instance();
  if (typeof opt.secret === 'string') {
    const hdWallet = new HdWallet(opt.secret, opt.password);
    const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
    return new EthereumUtils(keys.privateKey, utils, currency);
  } else if ((opt.secret as PrivateKeys).ethereumClassic) {
    return new EthereumUtils(opt.secret.ethereumClassic, utils, currency);
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
    EthereumClassicRoutingModule
  ]
})
export class EthereumClassicModule {
}
