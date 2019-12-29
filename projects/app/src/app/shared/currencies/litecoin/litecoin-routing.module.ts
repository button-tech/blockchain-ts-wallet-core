import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendComponent } from 'projects/app/src/app/send/send.component';

const routes: Routes = [{path: '', component: SendComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LitecoinRoutingModule {
}
