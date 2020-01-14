import { Component, OnInit } from '@angular/core';
import { NotificationService } from './error/service/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  notification: string;
  showNotification: boolean;

  constructor(private notificationService: NotificationService) {
    //
    // Here, we need to take params from url and start fetch, other components will take fetched params via DI
    //
  }

  ngOnInit() {
    this.notificationService
      .notification$
      .subscribe(message => {
        this.notification = message;
        this.showNotification = true;
      });
  }
}
