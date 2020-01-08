import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BitcoinRoutingModule } from './bitcoin-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { UtxoBasedUtils } from '../utxoBased.utils';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { Bitcoin } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Bitcoin.Instance();
  const hdWallet = new HdWallet(opt.mnemonic, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new UtxoBasedUtils(keys.privateKey, keys.address, utils, currency);
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
    BitcoinRoutingModule
  ]
})
export class BitcoinModule {
}
