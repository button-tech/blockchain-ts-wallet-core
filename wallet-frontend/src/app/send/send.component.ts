import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { IBlockchainService, ISomeInterface } from './send.module';
import { BlockchainUtilsService } from '../shared/blockchainUtils.service';


@Component({
  selector: 'app-send',
  template: `
    <p>
      Send works!
      <button (click)="send()">SEND</button>
    </p>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SendComponent implements OnInit {

  bcs: IBlockchainService;

  constructor(@Inject('SuperService') private x: ISomeInterface, private utils: BlockchainUtilsService) {
    console.log(x.someId);
    console.log(this.utils);
    this.bcs = x.factory(utils);

    const address = this.bcs.getAddress(x.someId);
    console.log(
      address
    );
  }

  ngOnInit() {
  }

  send() {

  }
}
