import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { BranchService } from 'src/app/services/branch/branch.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';

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
        lat: 32.1,
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