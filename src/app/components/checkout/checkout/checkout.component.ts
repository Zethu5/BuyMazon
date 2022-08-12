import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _moment from 'moment';

import {defaultFormat as _rollupMoment, Moment} from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class CheckoutComponent implements OnInit {

  addressForm!: FormGroup
  billingForm!: FormGroup

  constructor(private userService: UserService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) this.router.navigate(['/'])

    this.addressForm = this.fb.group({
      firstName: [null, [Validators.required, this.isNameValid]],
      lastName: [null, [Validators.required, this.isNameValid]],
      firstAddress: [null, [Validators.required]],
      secondAddress: [null, []],
      city: [null, [Validators.required]],
      region: [null, [Validators.required]],
      zipCode: [null, [Validators.required, this.isZipCode]],
      phone: [null, [Validators.required, this.isPhone]],
      email: [null, [Validators.required, this.isEmail]],
    })

    this.billingForm = this.fb.group({
      cardNumber: [null, [Validators.required, this.isValidCreditCard]],
      nameOnCard: [null, [Validators.required, this.isNameOnCardValid]],
      expirationDate: [null, [Validators.required, this.isValidExpirationDate]],
      securityCode: [null, [Validators.required, this.isValidSecurityCode]],
    })
  }

  isEmail(control: AbstractControl) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

    if (!emailRegex.test(control.value)) {
      return { invalidEmail: true}
    }
    return null
  }

  isNameValid(control: AbstractControl) {
    const nameRegex = /^[a-z]+$/i

    if (!nameRegex.test(control.value)) {
      return { invalidName: true}
    }
    return null
  }

  isZipCode(control: AbstractControl) {
    const zipCodeRegex = /^\d{4}[1-9]|\d{3}[1-9]\d|\d{2}[1-9]\d{2}|\d[1-9]\d{3}|[1-9]\d{4}$/

    if (!zipCodeRegex.test(control.value)) {
      return { invalidZipCode: true}
    }
    return null
  }

  isPhone(control: AbstractControl) {
    const phoneRegex = /^(?:0*[1-9]0*)+$/

    if (!phoneRegex.test(control.value)) {
      return { invalidPhoneNumber: true}
    }
    return null
  }

  isValidCreditCard(control: AbstractControl) {
    const creditCardNumberRegex = /^\d+$/i

    if (!control.value || !creditCardNumberRegex.test(control.value)) {
      return { invalidCreditCard: true}
    }

    // Luhn algorithm
    let s = 0;
    let doubleDigit = false;
    for (const d of [...control.value].reverse()) {
      let digit = +d;
      if (doubleDigit) {
        digit *= 2;
        if (digit > 9)
          digit -= 9;
      }
      s += digit;
      doubleDigit = !doubleDigit;
    }

    const checkLuhn = s % 10 === 0;

    if (!checkLuhn) {
      return { invalidCreditCard: true}
    }

    return null
  }

  isNameOnCardValid(control: AbstractControl) {
    const nameOnCardRegex = /^[a-z]+\s[a-z]+$/i

    if (!nameOnCardRegex.test(control.value)) {
      return { invalidNameOnCard: true}
    }

    return null
  }

  isValidExpirationDate(control: AbstractControl) {
    const expDate = _moment(control.value).toDate()

    if (!_moment(control.value).isValid()) {
      return { invalidExpirationDate: true}
    }

    if (expDate.getTime() - Date.now() < 0) {
      return { invalidExpirationDate: true}
    }

    return null
  }

  isValidSecurityCode(control: AbstractControl) {
    const securityCodeRegex = /^\d{3,4}$/i

    if (!securityCodeRegex.test(control.value)) {
      return { invalidSecurityCode: true}
    }

    return null
  }

  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = _moment();
    ctrlValue.set('date', 31)
    ctrlValue.set('hour', 23)
    ctrlValue.set('minute', 59)
    ctrlValue.set('second', 59)
    ctrlValue.set('millisecond', 999)
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.billingForm.controls['expirationDate'].setValue(ctrlValue);
    datepicker.close();
  }
}
