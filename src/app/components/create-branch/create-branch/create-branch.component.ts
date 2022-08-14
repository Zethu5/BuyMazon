import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Loader } from '@googlemaps/js-api-loader';
import * as L from 'leaflet';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { google_maps_api_key } from 'src/environments/environment';
import { BranchesComponent } from '../../branches/branches/branches.component';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css']
})
export class CreateBranchComponent implements OnInit {

  createBranchForm!: FormGroup
  branches!: any
  click_data!: any
  map!: any

  constructor(private fb: FormBuilder,
    private branchService: BranchService,
    private geoLocationService: GeolocationService,
    private dialogRef: MatDialogRef<BranchesComponent>,
  ) { }

  ngOnInit(): void {
    this.createBranchForm = this.fb.group({
      city: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required, this.isPhone]],
      picture: [null, [Validators.required, this.isImageURI]],
    })
    
    this.getBranches()
    this.initMap()
  }

  initMap(): void {
    this.map = L.map('create-branch-map', {
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

    this.map.on('click', (event: any) => {
      const lat = event.latlng.lat
      const lng = event.latlng.lng

      this.geoLocationService.getLocationData(lat, lng).subscribe((data: any) => {
        if (!data.address?.city) return

        this.onClickedMap({
          city: data.address.city,
          full_name: data.display_name,
          coordinates: {lat: lat, lng: lng}
        })
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

  getBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches = data
    })
  }

  isImageURI(control: AbstractControl) {
    let imageRegex = /(https?:\/\/.*\.(?:png|jpg))/i
    if (!imageRegex.test(control.value)) {
      return { invalidImageURI: true }
    }
    return null
  }

  isPhone(control: AbstractControl) {
    let phoneRegex = /^0[1-9]\-\d{7}$/

    if (!phoneRegex.test(control.value)) {
      return { invalidPhoneNumber: true }
    }
    return null
  }

  onBranchSubmit() {
    if(!this.createBranchForm.valid) return

    let branch: Branch = {
      city: this.createBranchForm.controls['city'].value,
      address: this.createBranchForm.controls['address'].value,
      phone: this.createBranchForm.controls['phone'].value,
      picture: this.createBranchForm.controls['picture'].value,
      coordinates: this.click_data.coordinates
    }

    this.branchService.createBranch(branch)
  }

  onClickedMap(data: any) {
    this.click_data = data
    this.createBranchForm.controls['city'].setValue(this.click_data.city)
    this.createBranchForm.controls['address'].setValue(this.click_data.full_name)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
