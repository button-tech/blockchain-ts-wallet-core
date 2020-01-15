import { Injectable, ErrorHandler, Injector, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorContext, ErrorService } from '../service/error.service';
import { NotificationService } from '../service/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorsHandler implements ErrorHandler {
  constructor(private notificationService: NotificationService,
              private errorsService: ErrorService,
              private injector: Injector,
              private zone: NgZone) {
  }

  handleError(error: any) {
    const router = this.injector.get(Router);

    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        // Handle offline error
        this.notificationService.notify('No Internet Connection');
        return;
      }

      // maybe will handle other http errors
    }

    console.error(error);

    this.zone.run(() => {
      this.errorsService
        .log(error)
        .subscribe((errorWithContextInfo: ErrorContext) => {
          router.navigate(['/error'], { queryParams: { message: errorWithContextInfo.message } });
        });
    });
  }

}

