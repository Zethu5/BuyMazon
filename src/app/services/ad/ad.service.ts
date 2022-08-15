import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ad } from 'src/app/models/ad';
import { api_base } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor(private http: HttpClient) {}

  getAds() {
    const url = `${api_base}/ads`
    return this.http.get(url)
  }

  getAd(id: string) {
    const url = `${api_base}/ads/${id}`
    return this.http.get(url)
  }

  createAd(ad: Ad) {
    const url = `${api_base}/ads`
    this.http.post(url, ad).subscribe()
  }

  updateAd(id: string, ad: any) {
    let url = `${api_base}/ads/${id}`
    this.http.put(url, ad).subscribe()
  }

  deleteAd(id: string, ad: any) {
    let url = `${api_base}/ads/${id}`
    this.http.delete(url, ad).subscribe()
  }
}
