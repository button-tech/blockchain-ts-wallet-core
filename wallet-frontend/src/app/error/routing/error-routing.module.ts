import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorComponent } from '../component/error.component';

const routes: Routes = [
  { path: 'error', component: ErrorComponent },
  // { path: '**', component: ErrorComponent, data: { error: 404 } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
