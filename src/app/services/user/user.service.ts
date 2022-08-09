import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';
import { api_base } from '../../../environments/environment'

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
}
