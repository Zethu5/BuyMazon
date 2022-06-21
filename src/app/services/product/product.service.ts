import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiBase: String
  private port: Number

  constructor(private http: HttpClient) { 
    this.port = 3000
    this.apiBase = `http://localhost:${this.port}/api`
  }

  getProducts() {
    const url = `${this.apiBase}/products`
    return this.http.get(url)
  }

  createProduct(product: Product) {
    const url = `${this.apiBase}/products`
    this.http.post(url, product).subscribe()
  }

  getProduct(id: string) {
    const url = `${this.apiBase}/products/${id}`
    return this.http.get(url)
  }

  deleteProduct(id: string) {
    const url = `${this.apiBase}/products/${id}`
    this.http.delete(url).subscribe()
  }

  updateProduct(id: string, product: Product) {
    const url = `${this.apiBase}/products/${id}`
    this.http.put(url, product).subscribe()
  }
}
