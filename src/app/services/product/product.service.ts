import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { api_base } from '../../../environments/environment'
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  userService = new UserService(this.http)

  constructor(private http: HttpClient) {}

  getProducts() {
    const url = `${api_base}/products`
    return this.http.get(url)
  }

  createProduct(product: Product) {
    const url = `${api_base}/products`
    this.http.post(url, product).subscribe()
  }

  getProduct(id: string) {
    const url = `${api_base}/products/${id}`
    return this.http.get(url)
  }

  deleteProduct(id: string) {
    const url = `${api_base}/products/${id}`
    this.http.delete(url).subscribe()
  }

  updateProduct(id: string, product: Product) {
    const url = `${api_base}/products/${id}`
    this.http.put(url, product).subscribe()
  }
}
