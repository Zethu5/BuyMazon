import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { api_base, local_storage_is_admin_property_name, local_storage_username_property_name } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    const url = `${api_base}/users`
    return this.http.get(url)
  }

  createUser(user: User) {
    const url = `${api_base}/users`
    this.http.post(url, user).subscribe()
  }

  getUser(id: string) {
    const url = `${api_base}/users/${id}`
    return this.http.get(url)
  }

  getUserByUsername(username: string) {
    const url = `${api_base}/users/username/${username}`
    return this.http.get(url)
  }

  deleteUser(id: string) {
    const url = `${api_base}/users/${id}`
    this.http.delete(url).subscribe()
  }

  updateUser(id: string, user: User) {
    const url = `${api_base}/users/${id}`
    this.http.put(url, user).subscribe()
  }

  login(username: string, password: string) {
    const url = `${api_base}/users/login`
    return this.http.post(url, {username: username, password: password})
  }

  isLoggedIn() {
    return localStorage.getItem(local_storage_username_property_name) ? true : false
  }

  isAdmin() {
    return localStorage.getItem(local_storage_is_admin_property_name) === 'true' ? true : false
  }

  getLocalStorageUserName() {
    return localStorage.getItem(local_storage_username_property_name)
  }

  addProductToUser(product: Product) {
    this.getUserByUsername(this.getLocalStorageUserName()!).subscribe((user: any) => {
      const url = `${api_base}/users/${user._id}/addproduct`
      this.http.put(url, {product: product}).subscribe()
    })
  }
}
