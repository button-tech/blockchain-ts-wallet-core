import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumRoutingModule } from './ethereum-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { Ethereum, Litecoin } from '../../../DomainCurrency';
import { EthereumUtils } from '../ethereum.utils';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Ethereum.Instance();
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
    EthereumRoutingModule
  ]
})
export class EthereumModule {
}
