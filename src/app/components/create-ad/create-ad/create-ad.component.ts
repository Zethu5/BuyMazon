import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Ad } from 'src/app/models/ad';
import { AdService } from 'src/app/services/ad/ad.service';
import { UserService } from 'src/app/services/user/user.service';
import { AdsComponent } from '../../ads/ads/ads.component';


@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  createAdForm!: FormGroup
  socket!: any

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private userService: UserService,
    private dialogRef: MatDialogRef<AdsComponent>) { }

  ngOnInit(): void {
    this.createAdForm = this.fb.group({
      info: [null, [Validators.required]],
      publisher: [this.userService.getLocalStorageUserName(), []],
      active: [false, []]
    })
  }


  onAdSubmit() {
    let ad: Ad = {
      info: this.createAdForm.controls['info'].value,
      publisher: this.createAdForm.controls['publisher'].value,
      active: this.createAdForm.controls['active'].value,
    }

    this.adService.createAd(ad)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
