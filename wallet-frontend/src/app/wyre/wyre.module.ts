import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WyreRoutingModule } from './wyre-routing.module';
import { WyreComponent } from './wyre.component';


@NgModule({
  declarations: [WyreComponent],
  imports: [
    CommonModule,
    WyreRoutingModule
  ]
})
export class WyreModule { }
