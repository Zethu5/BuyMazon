import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { AdsComponent } from '../../ads/ads/ads.component';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.css']
})
export class UpdateAdComponent implements OnInit {

  updateAdForm!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public ad: any,
    private fb: FormBuilder,
    private adService: AdService,
    private dialogRef: MatDialogRef<AdsComponent>) { }

  ngOnInit(): void {
    this.updateAdForm = this.fb.group({
      info: [this.ad.info, [Validators.required]],
      publisher: [this.ad.publisher, []],
      active: [this.ad.active, []]
    })
  }

  onAdSubmit() {
    let ad: any = {
      info: this.updateAdForm.controls['info'].value,
      publisher: this.updateAdForm.controls['publisher'].value,
      active: this.updateAdForm.controls['active'].value
    }

    this.adService.updateAd(this.ad._id, ad)
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
