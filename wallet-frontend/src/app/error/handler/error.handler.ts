import { Injectable, ErrorHandler, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorContext, ErrorService } from '../service/error.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorsHandler implements ErrorHandler {
  constructor(private injector: Injector) {
  }

  handleError(error: any) {
    const notificationService = this.injector.get(NotificationService);
    const errorsService = this.injector.get(ErrorService);
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        // Handle offline error
        return notificationService.notify('No Internet Connection');
      }

      // maybe will handle other http errors
    }

    console.error(error);
    errorsService
      .log(error)
      .subscribe((errorWithContextInfo: ErrorContext) => {
        router.navigate(['/error'], { queryParams: { message: errorWithContextInfo.message } });
      });
  }

}
