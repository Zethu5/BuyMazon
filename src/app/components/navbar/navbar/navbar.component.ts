import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  username!: any
  socket!: any

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('buymazon_username')
    this.updateUserState()
  }

  updateUserState() {
    this.socket = io.io(socket_connection)
    this.socket.on('loggedIn', (username: string) => {
      this.username = username
    })
  }

  login() {
    this.router.navigateByUrl('/login')
  }

  register() {
    this.router.navigateByUrl('/register')
  }

  logout() {
    localStorage.clear()
    this.ngOnInit()
  }


}
