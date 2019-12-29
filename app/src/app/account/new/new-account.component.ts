import { Component } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';

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
  styles: [
      `
      .example-form {
        min-width: 150px;
        max-width: 500px;
        width: 100%;
      }

      .example-full-width {
        width: 100%;
      }

      .example-form > * {
        margin-bottom: 10px;
      }

      .example-button-row button,
      .example-button-row a {
        margin-right: 8px;
      }
    `
  ],
})
export class NewAccountComponent {

  color = 'accent';
  checked = false;

  get email() { return this.newAccountForm.get('email'); }

  // get power() { return this.heroForm.get('power'); }

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
}
