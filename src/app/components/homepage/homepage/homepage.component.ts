import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdService } from 'src/app/services/ad/ad.service';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  categories: any = []
  ads: any = []
  socket!: any

  constructor(
    private adService: AdService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categories.push({
      name: 'Manufacturers',
      image: 'https://i.imgur.com/kjLiqN6.png',
      ref: '/manufacturers',
      allowed: ['admins']
    })

    this.categories.push({
      name: 'Branches',
      image: 'https://i.imgur.com/UyZ5rBN.png',
      ref: '/branches',
      allowed: ['users', 'admins']
    })

    this.categories.push({
      name: 'Products',
      image: 'https://i.imgur.com/FdDTEXb.png',
      ref: '/products',
      allowed: ['users', 'admins']
    })

    this.categories.push({
      name: 'Statistics',
      image: 'https://i.imgur.com/j8RnXQh.png',
      ref: '/statistics',
      allowed: ['admins']
    })

    this.categories.push({
      name: 'Ads',
      image: 'https://i.imgur.com/AiZmuRZ.png',
      ref: '/ads',
      allowed: ['users', 'admins']
    })

    this.getAds()
    this.updateAds()
  }

  goToPage(category: any) {
    this.router.navigate([category.ref])
  }

  getAds() {
    this.adService.getAds().subscribe((data: any) => {
      this.ads = data
    })
  }

  updateAds() {
    this.socket = io.io(socket_connection)
    this.socket.on('adUpdate', () => {
      this.getAds()
    })
  }

  dateToString(date: any) {
    return (new Date(date)).toLocaleDateString()
  }

  isLoggedIn() {
    return this.userService.isLoggedIn()
  }

  isAdmin() {
    return this.userService.isAdmin()
  }

  isAllowedToDisplayCategory(category: any) {
    if(category.allowed.includes('users')) return true
    return (this.isAdmin() ? true : false)
  }
}
