import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { local_storage_is_admin_property_name, local_storage_username_property_name } from 'src/environments/environment';

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
    if (localStorage.getItem(local_storage_username_property_name)) this.router.navigateByUrl('/')

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
    localStorage.setItem(local_storage_username_property_name, data.username)
    localStorage.setItem(local_storage_is_admin_property_name, data.isAdmin)
    this.router.navigateByUrl('/')
  }
}
