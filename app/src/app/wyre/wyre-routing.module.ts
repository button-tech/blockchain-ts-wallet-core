import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WyreComponent } from './wyre.component';

const routes: Routes = [{ path: '', component: WyreComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WyreRoutingModule { }
