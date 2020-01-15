import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { HdWallet } from '../../shared/services/hd-wallet/hd-wallet.service';
import { Security } from '../../shared/services/security/security.service';
import { GetGuid } from '../../shared/shared.module';
import { BotBackendProvider } from '../../shared/providers/bot-backend.provider';
import { ActivatedRoute } from '@angular/router';
import { CreateAccountRequest } from '../../shared/dto/bot-backend.dto';
import { AccountService } from '../../shared/services/account/account.service';
import { RenderQrcodeComponent } from '../../shared/components/qrcode/renderQrcode/renderQrcode.component';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

/** @title Input with a custom ErrorStateMatcher */
@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css'],
})


export class NewAccountComponent {
  constructor(private http: HttpClient,
              private botApi: BotBackendProvider,
              private router: ActivatedRoute) {
  }

  @ViewChild(RenderQrcodeComponent, { static: false })
  private renderQrCode: RenderQrcodeComponent;

  isQrCodeHidden = true;

  checked = false;
  color = 'accent';

  newAccountForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', Validators.required),
    repeatPassword: new FormControl('', Validators.required),
    termOfService: new FormControl('', Validators.required),
    privacyPolicy: new FormControl('', Validators.required),
    sendQr: new FormControl(true),
  });

  matcher = new MyErrorStateMatcher();


  get email() {
    return this.newAccountForm.get('email');
  }

  get password(): string {
    return this.newAccountForm.value.password;
  }

  createNewAccount() {
    const guid = GetGuid(this.router, 'create');

    const newMnemonic = HdWallet.generateMnemonic();
    const cipher = Security.encryptSecret(newMnemonic, this.password);
    this.renderQrCode.render(cipher);

    AccountService.saveAccount(newMnemonic);

    const addresses = AccountService.generateKeyPairs(newMnemonic, this.password);

    if (this.checked) {
      const req: CreateAccountRequest = {
        bitcoinAddress: addresses.Bitcoin,
        bitcoinCashAddress: addresses.BitcoinCash,
        litecoinAddress: addresses.Litecoin,
        ethereumAddress: addresses.Ethereum,
        ethereumClassicAddress: addresses.EthereumClassic,
        wavesAddress: addresses.Waves,
        stellarAddress: addresses.Stellar,
        // mail: this.email
      };
      this.botApi.registerAccount$(req, guid).subscribe();
    }

    this.isQrCodeHidden = false;
  }

}

