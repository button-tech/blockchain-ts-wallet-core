import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LitecoinRoutingModule } from './litecoin-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { UtxoBasedUtils } from '../utxoBased.utils';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { Litecoin } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const ltc = Litecoin.Instance();
  const hdWallet = new HdWallet(opt.mnemonic, opt.password);
  const keys = hdWallet.generateKeyPair(ltc, opt.derivationPath);
  return new UtxoBasedUtils(keys.privateKey, keys.address, utils, ltc);
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
