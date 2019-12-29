import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AccountRoutingModule } from './account-routing.module';
import { NewAccountComponent } from './new/new-account.component';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatInputModule, MatSlideToggleModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImportAccountComponent } from './import/import-account.component';


@NgModule({
  declarations: [
    NewAccountComponent,
    ImportAccountComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    MatInputModule,
    MatButtonModule,
    AccountRoutingModule,
    MatCardModule,
    MatCheckboxModule,
  ]
})
export class AccountModule {
}
