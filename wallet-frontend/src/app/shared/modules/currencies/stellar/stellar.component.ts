import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-xlm',
  template: `
    <p>
      xlm works! <button (click)="sendTx()">SEND</button>
    </p>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class StellarComponent implements OnInit {

  constructor() {

  }

  ngOnInit() {
  }

  sendTx() {
    // TODO:
  }
}
