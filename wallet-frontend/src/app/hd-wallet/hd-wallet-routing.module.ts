import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HdWalletComponent } from './hd-wallet.component';

const routes: Routes = [{ path: '', component: HdWalletComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HdWalletRoutingModule { }
