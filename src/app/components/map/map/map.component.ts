import { createInjectorType } from '@angular/compiler/src/render3/r3_injector_compiler';
import { Component, OnInit } from '@angular/core';
import { Loader } from '@googlemaps/js-api-loader';
import * as L from 'leaflet';
import { BranchService } from 'src/app/services/branch/branch.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { google_maps_api_key } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map!: any

  constructor(private geoLocationService: GeolocationService, private branchService: BranchService) {}

  ngOnInit(): void {
    this.initMap()
  }

  initMap(): void {
    this.map = L.map('map', {
      center: {
        lat: 31.32,
        lng: 35
      },
      zoom: 8
    })

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    })

    tiles.addTo(this.map)

    this.map.on('click', (event: any) => {
      const lat = event.latlng.lat
      const lng = event.latlng.lng

      this.geoLocationService.getLocationData(lat, lng).subscribe((data: any) => {
        if (!data.address?.city) return

        const click_data = {
          city: data.address.city,
          full_name: data.display_name,
          coordinates: {lat: lat, lng: lng}
        }

        // do something with the click_data
      })
    })

    this.branchService.getBranches().subscribe(data => {
      this.setMapMarkers(this.map, data)
    })
  }

  setMapMarkers(map: any, branches: any) {
    branches.forEach((branch: any) => {
      L.marker(
        [branch.coordinates.lat, branch.coordinates.lng],
      ).bindTooltip(branch.address)
      .addTo(map)
    });
  }
}