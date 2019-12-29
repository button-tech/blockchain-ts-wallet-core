import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  constructor() {
    //
    // Here, we need to take params from url and start fetch, other components will take fetched params via DI
    //
  }
}
