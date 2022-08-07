import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manufacturer } from '../../models/manufacturer'
import { api_base } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class ManufacturerService {
  constructor(private http: HttpClient) {}

  getManufacturers() {
    const url = `${api_base}/manufacturers`
    return this.http.get(url)
  }

  createManufacturer(manufacturer: Manufacturer) {
    const url = `${api_base}/manufacturers`
    this.http.post(url, manufacturer).subscribe()
  }

  getManufacturer(id: string) {
    const url = `${api_base}/manufacturers/${id}`
    return this.http.get(url)
  }

  deleteManufacturer(id: string) {
    const url = `${api_base}/manufacturers/${id}`
    this.http.delete(url).subscribe()
  }

  updateManufacturer(id: string, manufacturer: Manufacturer) {
    const url = `${api_base}/manufacturers/${id}`
    this.http.put(url, manufacturer).subscribe()
  }

  getManufacturerSumProducts(id: string) {
    const url = `${api_base}/manufacturers/${id}/num_products`
    return this.http.get(url)
  }
}
