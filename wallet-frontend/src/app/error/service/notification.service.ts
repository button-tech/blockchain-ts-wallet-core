import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class NotificationService {

  private notification: BehaviorSubject<string> = new BehaviorSubject(null);
  readonly notification$: Observable<string> = this.notification.asObservable();

  constructor() {
  }

  notify(message) {
    this.notification.next(message);
  }

}
