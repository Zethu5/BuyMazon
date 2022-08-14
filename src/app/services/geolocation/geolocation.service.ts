import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  geolocation_api_url_base: String = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2'

  constructor(private http: HttpClient) { }


  getLocationData(lat: Number, lng: Number) {
    //https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=47.217954&lon=-1.552918
    let url = this.geolocation_api_url_base + `&lat=${lat}&lon=${lng}`
    return this.http.get(url)
  }
}
