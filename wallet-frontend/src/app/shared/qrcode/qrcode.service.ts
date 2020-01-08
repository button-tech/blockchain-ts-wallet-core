import * as QRCode from 'easyqrcodejs';
import { ElementRef } from '@angular/core';

type CorrectLevel = 'L' | 'M' | 'Q' | 'H';
type QuietZoneColor = 'transparent' | string;

export interface Options {
  text: string;
  width?: number;
  height?: number;
  colorDark?: string;
  colorLight?: string;
  correctLevel?: CorrectLevel;
  dotScale?: number; // 0 <= x <= 1

  quietZone?: 0;
  quietZoneColor?: QuietZoneColor;

  logo?: string;
  logoWidth?: number;
  logoHeight?: number;
  logoBackgroundColor?: string;
  logoBackgroundTransparent?: boolean;

  backgroundImage?: string;
  backgroundImageAlpha?: number; // Background image transparency, value between 0 and 1. default is 1.
  autoColor?: boolean;

  PO?: string; // Global Posotion Outer color. if not set, the defaut is `colorDark`
  PI?: string; // Global Posotion Inner color. if not set, the defaut is `colorDark`
  PO_TL?: string; // Posotion Outer color - Top Left
  PI_TL?: string; // Posotion Inner color - Top Left
  PO_TR?: string; // Posotion Outer color - Top Right
  PI_TR?: string; // Posotion Inner color - Top Right
  PO_BL?: string; // Posotion Outer color - Bottom Left
  PI_BL?: string; // Posotion Inner color - Bottom Left

  AO?: string; // Alignment Outer. if not set, the defaut is `colorDark`
  AI?: string; // Alignment Inner. if not set, the defaut is `colorDark`

  timing?: string; // Global Timing color. if not set, the defaut is `colorDark`
  timing_H?: string; // Horizontal timing color
  timing_V?: string; // Vertical timing color


  title?: string; // content
  titleFont?: string; // font. default is "bold 16px Arial"
  titleColor?: string; // color. default is "#000"
  titleBackgroundColor?: string; // background color. default is "#fff"
  titleHeight?: number; // height, including subTitle. default is 0
  titleTop?: number; // draws y coordinates. default is 30

  subTitle?: string; // content
  subTitleFont?: string; // font. default is "14px Arial"
  subTitleColor?: string; // color. default is "4F4F4F"
  subTitleTop?: string; // draws y coordinates. default is 0

  onRenderingStart?: () => {};
}

export class QrCode {

  constructor(private options: Options) {
  }

  append(elem: ElementRef) {
    new QRCode(elem.nativeElement, this.options);
  }

}
