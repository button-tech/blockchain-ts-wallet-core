import { NgModule, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from './service/error.service';
import { ErrorComponent } from './component/error.component';
import { ErrorsHandler } from './handler/error.handler';
import { ErrorRoutingModule } from './routing/error-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ErrorRoutingModule,
  ],
  declarations: [
    ErrorComponent
  ],
  providers: [
    ErrorService,
    {
      provide: ErrorHandler,
      useClass: ErrorsHandler,
    },
  ]
})
export class ErrorsModule {
}
