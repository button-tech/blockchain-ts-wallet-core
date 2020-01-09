import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EthereumRoutingModule } from './ethereum-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Ethereum  } from '../../../DomainCurrency';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';
import { EthereumUtils } from '../ethereum.utils';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Ethereum.Instance();
  if (typeof opt.secret === 'string') {
    const hdWallet = new HdWallet(opt.secret, opt.password);
    const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
    return new EthereumUtils(keys.privateKey, utils, currency);
  } else if ((opt.secret as PrivateKeys).ethereum) {
    return new EthereumUtils(opt.secret.ethereum, utils, currency);
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
    EthereumRoutingModule
  ]
})
export class EthereumModule {
}
