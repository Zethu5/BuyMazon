import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Loader } from '@googlemaps/js-api-loader';
import * as L from 'leaflet';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { GeolocationService } from 'src/app/services/geolocation/geolocation.service';
import { google_maps_api_key } from 'src/environments/environment';
import { BranchesComponent } from '../../branches/branches/branches.component';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent implements OnInit {

  updateBranchForm!: FormGroup
  branch!: any
  click_data!: any
  map!: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private branchService: BranchService,
    private geoLocationService: GeolocationService,
    private dialogRef: MatDialogRef < BranchesComponent > , ) {}

  ngOnInit(): void {
    this.branch = this.data.branch

    this.updateBranchForm = this.fb.group({
      city: [this.branch.city, [Validators.required]],
      address: [this.branch.address, [Validators.required]],
      phone: [this.branch.phone, [Validators.required, this.isPhone]],
      picture: [this.branch.picture, [Validators.required, this.isImageURI]],
    })

    this.initMap()
  }

  initMap(): void {
    this.map = L.map('update-branch-map', {
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

  onClickedMap(data: any) {
    this.click_data = data
    this.updateBranchForm.controls['city'].setValue(this.click_data.city)
    this.updateBranchForm.controls['address'].setValue(this.click_data.full_name)
  }

  onBranchSubmit() {
    if(!this.updateBranchForm.valid) return

    let updatedBranch: Branch = {
      city: this.updateBranchForm.controls['city'].value,
      address: this.updateBranchForm.controls['address'].value,
      phone: this.updateBranchForm.controls['phone'].value,
      picture: this.updateBranchForm.controls['picture'].value,
      coordinates: this.click_data.coordinates
    }

    this.branchService.updateBranch(this.branch._id, updatedBranch)

    this.dialogRef.close({
      event: 'Updated'
    })
  }
}
