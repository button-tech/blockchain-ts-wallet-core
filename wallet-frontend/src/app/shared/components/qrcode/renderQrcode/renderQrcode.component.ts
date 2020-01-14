import {
  Component, ElementRef, ViewChild,
} from '@angular/core';
import { QrCode } from '../qrcode.service';
import { QrCodeData } from '../../../shared.module';
import { Cipher } from '../../../services/security/security.service';

@Component({
  selector: 'app-render-qr-code',
  templateUrl: './renderQrcode.component.html',
  styles: []
})
export class RenderQrcodeComponent {

  href: string;

  @ViewChild('qrcode', { static: false })
  private qrcode: ElementRef;

  render(cipher: Cipher) {
    document.querySelector('div#qrcode').innerHTML = '';

    const qrData: QrCodeData = {
      mnemonic: cipher.text,
      iv: cipher.iv,
      salt: cipher.salt
    };
    const qrCodeData = { text: JSON.stringify(qrData) };
    const qr = new QrCode();
    qr.render(qrCodeData, this.qrcode);
    this.downloadImage();
  }

  private downloadImage() {
    this.href = document.getElementsByTagName('img')[0].src;
  }


}
