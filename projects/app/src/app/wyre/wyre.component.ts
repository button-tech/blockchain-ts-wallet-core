import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-wyre',
  template: `
    <p>
      wyre works!
    </p>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class WyreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
