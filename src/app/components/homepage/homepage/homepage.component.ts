import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdService } from 'src/app/services/ad/ad.service';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';

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
    private router: Router
  ) { }

  ngOnInit(): void {
    this.categories.push({
      name: 'Manufacturers',
      image: 'https://i.imgur.com/kjLiqN6.png',
      ref: '/manufacturers'
    })

    this.categories.push({
      name: 'Branches',
      image: 'https://i.imgur.com/UyZ5rBN.png',
      ref: '/branches'
    })

    this.categories.push({
      name: 'Products',
      image: 'https://i.imgur.com/FdDTEXb.png',
      ref: '/products'
    })

    this.categories.push({
      name: 'Statistics',
      image: 'https://i.imgur.com/j8RnXQh.png',
      ref: '/statistics'
    })

    this.categories.push({
      name: 'Ads',
      image: 'https://i.imgur.com/AiZmuRZ.png',
      ref: '/ads'
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

}
