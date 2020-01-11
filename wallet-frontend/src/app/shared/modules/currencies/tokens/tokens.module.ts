import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensRoutingModule } from './tokens-routing.module';
import { SendModule } from '../../../../send/send.module';
import { NodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, PrivateKeys, SharedModule } from '../../../shared.module';
import { Ethereum } from '../../../DomainCurrency';
import { EthereumContractUtils } from '../ethereumContract.utils';
import { HdWallet } from '../../../services/hd-wallet/hd-wallet.service';

export function init(utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  // todo: make a case for OLD VERSION with private key but with non-zero derivation path
  const currency = Ethereum.Instance();
  if (typeof opt.secret === 'string') {
    return handleMnemonicVersion(currency, utils, opt);
  } else if ((opt.secret as PrivateKeys).Ethereum) {
    if (opt.derivationPath === 0) {
      return handlePrivateKeysVersion(currency, utils, opt);
    } else {
      opt.secret = opt.secret.Waves;
      return handleMnemonicVersion(currency, utils, opt);
    }
  } else {
    // todo: handle error: this currency doesn't exist in privateKeys object
  }
}

function handleMnemonicVersion(currency: Ethereum, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  const hdWallet = new HdWallet(opt.secret as string, opt.password);
  const keys = hdWallet.generateKeyPair(currency, opt.derivationPath);
  return new EthereumContractUtils(keys.privateKey, utils, currency);
}

function handlePrivateKeysVersion(currency: Ethereum, utils: NodeApiProvider, opt: CurrencyFactoryOptions) {
  return new EthereumContractUtils((opt.secret as PrivateKeys).Ethereum, utils, currency);
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
