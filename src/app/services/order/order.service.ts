import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from 'src/app/models/order';
import { api_base } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders() {
    const url = `${api_base}/orders`
    return this.http.get(url)
  }

  createOrder(order: Order) {
    const url = `${api_base}/orders`
    return this.http.post(url, order)
  }
}