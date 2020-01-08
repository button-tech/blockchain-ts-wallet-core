import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumClassicRoutingModule } from './ethereumClassic-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { EthereumClassic } from '../../../DomainCurrency';
import { EthereumUtils } from '../ethereum.utils';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = EthereumClassic.Instance();
  const hdWallet = new HdWallet(opt.mnemonic, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new EthereumUtils(keys.privateKey, keys.address, utils, currency);
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
