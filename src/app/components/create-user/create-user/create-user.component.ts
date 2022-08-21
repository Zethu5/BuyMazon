import { Component, OnInit } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  createUserForm!: FormGroup

  constructor(private fb: FormBuilder,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      username: [null, [
        Validators.required,Validators.minLength(3),
        Validators.maxLength(15), 
      ],[this.isUsernameNotTaken(this.userService)]],
      password: [null, [Validators.required, this.isPasswordValid]],
      email: [null, [Validators.required, this.isEmail]],
      firstName: [null, [Validators.required, this.isNameValid]],
      lastName: [null, [Validators.required, this.isNameValid]],
      dateOfBirth: [null, [Validators.required, this.isDateOfBirthValid]],
      creationDate: [null, [Validators.required]],
      isAdmin: [false, []],
      products: [[], []],
    })
  }

  // Minimum eight characters, at least one letter and one number
  isPasswordValid(control: AbstractControl) {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/

    if (!passwordRegex.test(control.value)) {
      return { invalidPassword: true}
    }
    return null
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

  isUsernameNotTaken(userService: UserService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<any> => {
      return userService
      .isUsernameNotTaken(control.value)
      .pipe(
        map((result: boolean) => 
          result ? { usernameTaken: true } : null
        )
      )
    }
  }

  isDateOfBirthValid(control: AbstractControl) {
    const dateValue = new Date(control.value)
    const nowDateValue = new Date(Date.now())

    // 567648000000 is 18 years in ms
    if (nowDateValue.getTime() - dateValue.getTime() < 567648000000) {
      return { invalidDateOfBirth: true}
    }
    return null
  }

  register() {
    this.createUserForm.controls['creationDate'].setValue(new Date(Date.now()))

    if(!this.createUserForm.valid) return

    let user: User = {
      username: this.createUserForm.controls['username'].value,
      password: this.createUserForm.controls['password'].value,
      email: this.createUserForm.controls['email'].value,
      creationDate: this.createUserForm.controls['creationDate'].value,
      firstName: this.createUserForm.controls['firstName'].value,
      lastName: this.createUserForm.controls['lastName'].value,
      dateOfBirth: this.createUserForm.controls['dateOfBirth'].value,
      isAdmin: false,
      products: [],
    }

    this.userService.createUser(user)
    this.router.navigate(['/']);
  }
}
