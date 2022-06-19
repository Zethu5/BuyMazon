import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manufacturer } from '../../models/manufacturer'

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {

  private apiBase: String
  private port: Number

  constructor(private http: HttpClient) { 
    this.port = 3000
    this.apiBase = `http://localhost:${this.port}/api`
  }

  getManufacturers() {
    const url = `${this.apiBase}/manufacturers`
    return this.http.get(url)
  }

  createManufacturer(manufacturer: Manufacturer) {
    const url = `${this.apiBase}/manufacturers`
    this.http.post(url, manufacturer).subscribe()
  }

  getManufacturer(id: string) {
    const url = `${this.apiBase}/manufacturers/${id}`
    return this.http.get(url)
  }
}
