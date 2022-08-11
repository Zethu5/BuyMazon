import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { api_base } from 'src/environments/environment';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private http: HttpClient, private userService: UserService) { }

  addProductToUser(product: Product) {
    this.userService.getUserByUsername(this.userService.getLocalStorageUserName()!).subscribe((user: any) => {
      const url = `${api_base}/cart/${user._id}/addproduct`
      this.http.put(url, {product: product}).subscribe()
    })
  }

  getUserCartById(id: string) {
      const url = `${api_base}/cart/${id}`
      return this.http.get(url)
  }
}