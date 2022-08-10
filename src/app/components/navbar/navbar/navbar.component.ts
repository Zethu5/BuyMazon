import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/services/user/user.service';
import { local_storage_username_property_name, socket_connection } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username!: any
  socket!: any
  numProductsInCart: number = this.getNumProductsInUserCart()!

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.username = localStorage.getItem(local_storage_username_property_name)
    this.updateUserState()
  }

  updateUserState() {
    this.socket = io.io(socket_connection)
    this.socket.on('loggedIn', (username: string) => {
      this.username = username
    })

    this.socket.on('loggedIn', (username: string) => {
      this.username = username
    })

    this.socket.on('userCartUpdate', () => {
      this.getNumProductsInUserCart()
    })
  }

  login() {
    this.router.navigate(['/login']);
  }

  register() {
    this.router.navigate(['/register']);
  }

  logout() {
    localStorage.clear()
    this.ngOnInit()
  }

  getNumProductsInUserCart() {
    this.userService.getUserByUsername(this.userService.getLocalStorageUserName()!).subscribe((user: any) => {
      this.numProductsInCart = user.products.length
    })
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }

  goToHomePage() {
    this.router.navigate(['/']);
  }
}
