import { Component, OnInit } from '@angular/core';
import { CMSService } from 'src/app/services/cms/cms.service';
import { ProductService } from 'src/app/services/product/product.service';
import { socket_connection } from 'src/environments/environment';
import * as io from 'socket.io-client'

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  products!: any
  socket!: any

  displayedColumns = [
    'name',
    'picture',
    'price',
    'manufacturer',
    'productionCountry',
    'code',
    'cmsResult'
  ]

  constructor(
    private cmsService: CMSService,
    private productService: ProductService) {}

  ngOnInit(): void {
    this.getProducts()
    this.updateUpperBound()
    this.updateProducts()
  }

  updateUpperBound() {
    this.cmsService.updateUpperBound()
  }

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data
    })
  }

  updateProducts() {
    this.socket = io.io(socket_connection)
    this.socket.on('newOrder', () => {
      this.productService.getProducts().subscribe((data) => {
        this.products = data
      })
    })
  }
}
