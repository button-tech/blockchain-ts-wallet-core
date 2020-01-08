import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { IBlockchainService, ISomeInterface } from './send.module';
import { NodeApiProvider } from '../shared/providers/node-api.provider';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styles: [],
  encapsulation: ViewEncapsulation.None
})
export class SendComponent implements OnInit {

  bcs: IBlockchainService;
  private address: string;

  constructor(@Inject('SuperService') private x: ISomeInterface, private utils: NodeApiProvider) {
    console.log(x.someId);
    console.log(this.utils);
    this.bcs = x.factory(utils);

    this.address = this.bcs.getAddress(x.someId);
    console.log(
      this.address
    );
  }

  ngOnInit() {

  }
}
