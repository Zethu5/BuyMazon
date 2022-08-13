import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  categories: any = []

  constructor(private router: Router) { }

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
  }

  goToPage(category: any) {
    this.router.navigate([category.ref])
  }

}
