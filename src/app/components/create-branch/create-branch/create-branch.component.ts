import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Loader } from '@googlemaps/js-api-loader';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
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
  map!: google.maps.Map
  map_element_id: string = 'google-map'

  constructor(private fb: FormBuilder,
    private branchService: BranchService,
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

    let loader = new Loader({
      apiKey: google_maps_api_key
    })

    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById(this.map_element_id) !, {
        center: {
          lat: 31.668944911571028,
          lng: 34.867502999920276
        },
        zoom: 7
      })

      this.branchService.getBranches().subscribe(data => {
        this.setMapMarkers(this.map, data)
      })

      let geocoder = new google.maps.Geocoder()

      google.maps.event.addListener(this.map, 'click', (event: {
        latLng: any;
      }) => {
        geocoder.geocode({
          location: event.latLng
        }, (results) => {
          const city = results![0].address_components.filter(address => address.types.includes('locality'))
          const full_name = results![0].formatted_address
          const coordinates = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng()
          }

          if (city.length == 0) {
            return
          }

          const click_data = {
            city: city[0].long_name,
            full_name: full_name,
            coordinates: coordinates
          }

          this.onClickedMap(click_data)
        })
      })
    })
  }

  setMapMarkers(map: google.maps.Map, branches: any) {
    branches.forEach((branch: any) => {
      const content_string = 
      '<div><h4>' + branch.city + '</h4></div>' +
      '<div><h5>' + branch.address + '</h5></div>' +
      '<div><h5>Phone: ' + branch.phone + '</h5></div>'

      let infowindow = new google.maps.InfoWindow({
        content: content_string
      })
      
      let marker = new google.maps.Marker({
        position: {
          lat: branch.coordinates.lat,
          lng: branch.coordinates.lng
        },
        map
      })

      marker.addListener("click", () => {
        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
      });
    })
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
