import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import * as StackTraceParser from 'stacktrace-parser';
import { StackFrame } from 'stacktrace-parser';
import { of } from 'rxjs';

export interface ErrorContext {
  name: string;
  time: number;
  location: LocationStrategy;
  url: string;
  status: number;
  message: string;
  stack: StackFrame[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  constructor(private locationStrategy: LocationStrategy) {
    // Listen to the navigation errors
    // this.router
    //   .events
    //   .subscribe((event) => {
    //     if (event instanceof NavigationError) {
    //       if (!navigator.onLine) {
    //         return;
    //       }
    //       // Redirect to the ErrorComponent
    //       this.log(event.error)
    //         .subscribe((errorWithContext) => {
    //           this.router.navigate(['/error'], { queryParams: errorWithContext });
    //         });
    //     }
    //   });
  }

  private parseStack(stack) {
    try {
      return StackTraceParser.parse(stack);
    } catch (e) {
      return null;
    }
  }

  private parseMessage(error): string {
    if (error.message) {
      return error.message;
    }
    if (error instanceof Object) {
      return undefined;
    }
    return error.toString();
  }

  log(error: any) {
    // todo: send error to custom server or sentry
    const errorToSend = this.addContextInfo(error);
    return of(errorToSend);
  }

  addContextInfo(error: Error | HttpErrorResponse) {
    const name = error.name || null;
    const time = new Date().getTime();
    const location = this.locationStrategy;
    const url = location instanceof PathLocationStrategy ? location.path() : '';
    const status = (error as HttpErrorResponse).status || null;
    const message = this.parseMessage(error);
    const stack = error instanceof HttpErrorResponse ? null : this.parseStack(error.stack);
    return { name, time, location, url, status, message, stack };
  }

}
