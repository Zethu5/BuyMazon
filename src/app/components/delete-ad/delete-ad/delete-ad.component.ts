import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { AdsComponent } from '../../ads/ads/ads.component';

@Component({
  selector: 'app-delete-ad',
  templateUrl: './delete-ad.component.html',
  styleUrls: ['./delete-ad.component.css']
})
export class DeleteAdComponent implements OnInit {

  constructor(
  @Inject(MAT_DIALOG_DATA) public ad: any,
  private adService: AdService,
  private dialogRef: MatDialogRef<AdsComponent>) { }

  ngOnInit(): void {
  }

  deleteAd() {
    this.adService.deleteAd(this.ad._id, this.ad)
    this.dialogRef.close()
  }
}
