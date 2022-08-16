import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { OrderService } from 'src/app/services/order/order.service';
import { ProductService } from 'src/app/services/product/product.service';
import { socket_connection } from '../../../../environments/environment';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  socket!: any
  bounds: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.initUpperBound()
    this.updateUpperBound()
  }

  getUpperBoundforProdCode(id: any) {
    let h1 = this.bounds[0][this.hash1(id)]
    let h2 = this.bounds[1][this.hash1(id)]
    let h3 = this.bounds[2][this.hash1(id)]
    let arr: Array < number > = [h1, h2, h3]
    return Math.max(...arr)
  }

  initUpperBound() {
    this.orderService.getOrders().subscribe((data: any) => {
      data.forEach((order: any) => {
        order.products.forEach((prod: any) => {
          let id = prod.code
          this.bounds[0][this.hash1(id)] += prod.amount
          this.bounds[1][this.hash2(id)] += prod.amount
          this.bounds[2][this.hash3(id)] += prod.amount
        })
      })
    })
  }

  updateUpperBound() {
    this.socket = io.io(socket_connection)
    this.socket.on('newOrder', (order: any) => {
      order.products.forEach((prod: any) => {
        let id = prod.code
        this.bounds[0][this.hash1(id)] += prod.amount
        this.bounds[1][this.hash2(id)] += prod.amount
        this.bounds[2][this.hash3(id)] += prod.amount
      })
    })
  }

  // Use this to get a upper bound for every product json
  returnUppBoundJSON() {
    this.productService.getProducts().subscribe((data: any) => {
      let boundsArray: any = []
      data.forEach((product: any) => {
        boundsArray.push({
          product: product,
          upperBound: this.getUpperBoundforProdCode(product.code)
        })
      })
    })
  }

  // CMS hash functions
  hash1(input: number) {
    return input % 5
  }

  hash2(input: number) {
    return (input * 7) % 5
  }

  hash3(input: number) {
    return (input * 2) % 5
  }
}
