import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';

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
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: "MM/YYYY"},
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
      expirationDate: [null, [Validators.required]],
      securityCode: [null, [Validators.required]],
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

  // Luhn algorithm
  isValidCreditCard(creditCardNumber: string) {
    let nDigits = creditCardNumber.length
    let sum = 0
    let parity = (nDigits - 2) % 2

    for (let i = 0; i < nDigits - 1; i++) {
      let digit = Number.parseInt(creditCardNumber[i])
      if (i % 2 == parity) digit *= 2
      if (digit > 9) digit -= 9
      sum += digit
    }

    return (sum % 10) == 0
  }

  isNameOnCardValid(control: AbstractControl) {
    const nameOnCardRegex = /^[a-z]+\s[a-z]+$/i

    if (!nameOnCardRegex.test(control.value)) {
      return { invalidNameOnCard: true}
    }
    return null
  }
}
