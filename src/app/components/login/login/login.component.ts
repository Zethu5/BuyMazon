import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup
  loginError: boolean = false

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    if (localStorage.getItem('buymazon_username')) this.router.navigateByUrl('/')

    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    })
  }

  login() {
    const username = this.loginForm.controls['username'].value
    const password = this.loginForm.controls['password'].value

    this.userService.login(username, password).subscribe({
      next: data => this.handleLogin(data),
      error: err => this.loginError = true
    })
  }

  handleLogin(data: any) {
    localStorage.setItem('buymazon_username', data.username)
    localStorage.setItem('buymazon_isAdmin', data.isAdmin)
    this.router.navigateByUrl('/')
  }
}
