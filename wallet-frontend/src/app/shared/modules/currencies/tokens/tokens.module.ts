import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TokensRoutingModule } from './tokens-routing.module';
import { SendModule } from '../../../../send/send.module';
import { INodeApiProvider } from '../../../providers/node-api.provider';
import { CurrencyFactoryOptions, SharedModule } from '../../../shared.module';
import { getPrivateKey } from '../currencies.utils';
import Index from '../../../../../../../lib/ts-wallet-core/src/index';
import { EthereumTokensService } from '../services/ethereumTokens.service';
import { Ethereum } from '../../../../../../../lib/ts-wallet-core/src/DomainCurrency';

export function init(utils: INodeApiProvider, opt: CurrencyFactoryOptions) {
  const currency = Ethereum.Instance();
  const privateKey = getPrivateKey(currency, opt);
  const blockchain = Index.EthereumTokens(privateKey);
  return new EthereumTokensService(privateKey, currency, blockchain, utils);
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
