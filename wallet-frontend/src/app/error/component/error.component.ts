import {
  AfterContentInit,
  Component
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles: []
})
export class ErrorComponent implements AfterContentInit {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  message = undefined;
  data;

  private static buildMessage(message): string {
    return message ? message : 'Contact @buttontechsupportbot';
  }

  ngAfterContentInit() {
    this.message = ErrorComponent.buildMessage(this.activatedRoute.snapshot.queryParams.message);
    this.data = this.activatedRoute.snapshot.data;
  }

}

