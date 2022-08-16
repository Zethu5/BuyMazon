import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CMS } from 'src/app/models/cms';
import { api_base } from 'src/environments/environment';
import { OrderService } from '../order/order.service';
import { map } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CMSService {

  bounds: number[][] = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]
  cms!: any

  constructor(
    private http: HttpClient,
    private orderService: OrderService) {}

  getCMS() {
    const url = `${api_base}/cms`
    return this.http.get(url)
  }

  getCMSById(id: string) {
    const url = `${api_base}/cms/${id}`
    return this.http.get(url)
  }

  createCMS(cms: CMS) {
    const url = `${api_base}/cms`
    this.http.post(url, cms).subscribe()
  }

  updateCMS(id: string, cms: CMS) {
    let url = `${api_base}/cms/${id}`
    this.http.put(url, cms).subscribe()
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

      this.createCMS({
        array0: this.bounds[0],
        array1: this.bounds[1],
        array2: this.bounds[2]
      })
    })
  }

  organizeCMS(data: any) {
    if(data.length == 0) {
      this.initUpperBound()
    }

    // theres only 1 cms table...
    // keeping a seperate cms object to save _id
    data = this.cms = data[0]

    this.bounds[0] = data.array0
    this.bounds[1] = data.array1
    this.bounds[2] = data.array2
    
    return this.bounds
  }

  getUpperBoundforProdCode(id: string) {
    return this.getCMS().pipe(map((data: any) => {
      this.organizeCMS(data)

      let h1 = this.bounds[0][this.hash1(Number.parseInt(id))]
      let h2 = this.bounds[1][this.hash1(Number.parseInt(id))]
      let h3 = this.bounds[2][this.hash1(Number.parseInt(id))]
      let arr: Array < number > = [h1, h2, h3]
  
      return Math.max(...arr)
    }))
  }

  updateUpperBound(order: any, bounds: any) {
    order.products.forEach((prod: any) => {
      let id = prod.code
      bounds[0][this.hash1(id)] += prod.amount
      bounds[1][this.hash2(id)] += prod.amount
      bounds[2][this.hash3(id)] += prod.amount
    })

    this.updateCMS(
      this.cms._id, {
        array0: this.bounds[0],
        array1: this.bounds[1],
        array2: this.bounds[2]
      }
    )
  }

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
