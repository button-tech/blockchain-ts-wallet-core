import {
  Component, Output,
} from '@angular/core';
import { QrCode } from './qrcode.service';
import EventEmitter = NodeJS.EventEmitter;

@Component({
  selector: 'app-qr-code',
  templateUrl: './qrcode.component.html',
  styles: []
})
export class QrcodeComponent {

  private file: any;
  @Output() messageEvent = new EventEmitter<string>();

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  async decodeImage() {
    await this.loadImage();
    const img = document.getElementById('qrImage') as HTMLImageElement;
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const qr = new QrCode();
    const data = qr.read(canvasElement, img);
    this.messageEvent.emit(data);
  }

  private loadImage(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.file) {
        reject('You don\'t upload qr code');
      }
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const data = fileReader.result.toString();
        (document.getElementById('qrImage') as HTMLImageElement).src = data;
        resolve(data);
      };
      fileReader.readAsDataURL(this.file);
    });
  }

}
