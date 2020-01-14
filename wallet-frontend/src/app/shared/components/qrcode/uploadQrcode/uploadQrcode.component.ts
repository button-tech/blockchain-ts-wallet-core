import {
  Component, EventEmitter, Output,
} from '@angular/core';
import { QrCode } from '../qrcode.service';

@Component({
  selector: 'app-upload-qr-code',
  templateUrl: './uploadQrcode.component.html',
  styles: []
})
export class UploadQrcodeComponent {

  private file: any;
  @Output() messageEvent = new EventEmitter<string>();

  constructor() {
  }

  fileChanged(e) {
    this.file = e.target.files[0];
  }

  async decodeImage() {
    await this.loadImage();
    const img = document.getElementById('qrImage') as HTMLImageElement;
    const canvasElement = document.getElementById('canvas') as HTMLCanvasElement;
    const qr = new QrCode();
    const data = qr.read(canvasElement, img);
    // todo: handle error
    this.messageEvent.emit(data.toString());
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
