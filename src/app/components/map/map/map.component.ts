import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as io from 'socket.io-client';
import { BranchService } from 'src/app/services/branch/branch.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { socket_connection } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map!: any
  layerGroup!: any
  socket!: any

  constructor(private geoLocationService: GeolocationService, private branchService: BranchService) {}

  ngOnInit(): void {
    this.initMap()
    this.updateMap()
  }

  updateMap() {
    this.socket = io.io(socket_connection)
    this.socket.on('branchUpdate', () => {
      this.setMapMarkers(this.map)
    })
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
    this.layerGroup = L.layerGroup().addTo(this.map)
    this.setMapMarkers(this.map)
  }

  setMapMarkers(map: any) {
    if(this.layerGroup) this.layerGroup.clearLayers()

    this.branchService.getBranches().subscribe((data: any) => {
      data.forEach((branch: any) => {
        L.marker(
          [branch.coordinates.lat, branch.coordinates.lng],
        ).bindTooltip(branch.address)
        .addTo(this.layerGroup)
      })
    })
  }
}