import { Component, OnInit } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import * as io from 'socket.io-client';
import { CMS } from 'src/app/models/cms';
import { CMSService } from 'src/app/services/cms/cms.service';
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
  cms!: any

  constructor(
    private productService: ProductService,
    private cmsService: CMSService
  ) {}

  ngOnInit(): void {
    this.updateUpperBound()
    this.returnUppBoundJSON()
  }

  updateUpperBound() {
    this.socket = io.io(socket_connection)
    this.socket.on('newOrder', (order: any) => {
      this.cmsService.getCMS().subscribe((data: any) => {
        let bounds = this.cmsService.organizeCMS(data)
        this.cmsService.updateUpperBound(order, bounds)
      })
    })
  }

  // Use this to get a upper bound for every product json
  returnUppBoundJSON() {
    this.productService.getProducts().subscribe((data: any) => {
      let boundsArray: any = []
      data.forEach(async (product: any) => {
        boundsArray.push({
          product: product,
          upperBound: await lastValueFrom(this.cmsService.getUpperBoundforProdCode(product.code))
        })
      })
    })
  }
}
