import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewAccountComponent } from './new/new-account.component';
import { ImportAccountComponent } from './import/import-account.component';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '', component: NewAccountComponent,
  },
  {
    path: 'new', component: NewAccountComponent,
  },
  {
    path: 'import', component: ImportAccountComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
