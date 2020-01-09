import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensRoutingModule } from './tokens-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Ethereum } from '../../../DomainCurrency';
import { EthereumContractUtils } from '../ethereumContract.utils';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';
import { EthereumUtils } from '../ethereum.utils';


export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Ethereum.Instance();
  if (typeof opt.secret === 'string') {
    const hdWallet = new HdWallet(opt.secret, opt.password);
    const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
    return new EthereumContractUtils(keys.privateKey, utils, currency);
  } else if ((opt.secret as PrivateKeys).ethereum) {
    return new EthereumContractUtils(opt.secret.ethereum, utils, currency);
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    SendModule.forChild({
        someId: 'current robot business master inner detect easy west diary smile creek coast fiber address gold',
        init
      },
    ),
    CommonModule,
    TokensRoutingModule
  ]
})
export class TokensModule {
}
