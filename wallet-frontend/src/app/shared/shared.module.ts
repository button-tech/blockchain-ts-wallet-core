import { NgModule } from '@angular/core';
import { NodeApiProvider } from './providers/node-api.provider';
import { BotBackendProvider } from './providers/bot-backend.provider';

@NgModule({
  declarations: [
    // BlockchainUtilsService
  ],
  imports: [],
  providers: [
    NodeApiProvider,
    BotBackendProvider
  ]
})
export class SharedModule {
  // For
}
