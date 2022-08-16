import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { CreateAdComponent } from '../../create-ad/create-ad/create-ad.component';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';
import { Ad } from 'src/app/models/ad';
import { UpdateAdComponent } from '../../update-ad/update-ad/update-ad.component';
import { DeleteAdComponent } from '../../delete-ad/delete-ad/delete-ad.component';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  ads!: any
  socket!: any

  constructor(private adService: AdService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAds()
    this.updateAds()
  }

  getAds() {
    this.adService.getAds().subscribe((data: any) => {
      this.ads = data
    })
  }

  updateAds() {
    this.socket = io.io(socket_connection)
    this.socket.on('adUpdate', () => {
      this.getAds()
    })
  }

  openCreateDialog(): void {
    this.dialog.open(CreateAdComponent, {
      width: '40vw',
      height: '95%',
      position: {
        top: '2vh'
      }
    })
  }

  openUpdateDialog(ad: Ad): void {
    this.dialog.open(UpdateAdComponent, {
      width: '40vw',
      height: '95%',
      position: {
        top: '2vh'
      },
      data: ad
    });
  }

  openDeleteDialog(ad: Ad): void {
    this.dialog.open(DeleteAdComponent, {data: ad});
  }

  changeAdState(ad: any) {
    ad.active = !ad.active
    this.adService.updateAd(ad._id, ad)
  }
}
