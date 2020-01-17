import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'wallet',
    loadChildren: () => import('./hd-wallet/hd-wallet.module').then(m => m.HdWalletModule)
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule)
  },
  // {
  //   path: 'send',
  //   loadChildren: () => {
  //     // import('../assets/example.js');
  //     // Could return Promise.all(...) in case want to load all dependencies first
  //     return import('./send/send.module').then(m => m.SendModule);
  //   }
  // },
  { path: 'send/waves', loadChildren: () => import('./shared/modules/currencies/waves/waves.module').then(m => m.WavesModule) },
  { path: 'send/xlm', loadChildren: () => import('./shared/modules/currencies/stellar/stellar.module').then(m => m.StellarModule) },
  { path: 'send/btc', loadChildren: () => import('./shared/modules/currencies/bitcoin/bitcoin.module').then(m => m.BitcoinModule) },
  {
    path: 'send/bch',
    loadChildren: () => import('./shared/modules/currencies/bitcoinCash/bitcoinCash.module').then(m => m.BitcoinCashModule)
  },
  { path: 'send/ltc', loadChildren: () => import('./shared/modules/currencies/litecoin/litecoin.module').then(m => m.LitecoinModule) },
  { path: 'send/eth', loadChildren: () => import('./shared/modules/currencies/ethereum/ethereum.module').then(m => m.EthereumModule) },
  {
    path: 'send/etc',
    loadChildren: () => import('./shared/modules/currencies/ethereumClassic/ethereumClassic.module').then(m => m.EthereumClassicModule)
  },
  // {
  //   path: 'send/ton',
  //   loadChildren: () => import('./shared/modules/currencies/ton/ton.module').then(m => m.TonModule)
  // }

  // {path: 'eth/send', loadChildren: () => import('./xlm/xlm.module').then(m => m.XlmModule)}
  // {path: 'eth/token', loadChildren: () => import('./xlm/xlm.module').then(m => m.XlmModule)}
  // {path: 'eth/1inch', loadChildren: () => import('./xlm/xlm.module').then(m => m.XlmModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
