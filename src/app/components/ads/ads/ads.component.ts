import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { CreateAdComponent } from '../../create-ad/create-ad/create-ad.component';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';
import { Ad } from 'src/app/models/ad';
import { UpdateAdComponent } from '../../update-ad/update-ad/update-ad.component';
import { DeleteAdComponent } from '../../delete-ad/delete-ad/delete-ad.component';
import { ProductService } from 'src/app/services/product/product.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  ads!: any
  adsClone!: any
  socket!: any
  products!: any
  selectedProductsFilterValue: any = []
  discountFilterValue!: any
  searchWordsFilterValue: any = []
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private adService: AdService, 
    private productService: ProductService,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAds()
    this.getProducts()
    this.updateAds()
  }

  getAds() {
    this.adService.getAds().subscribe((data: any) => {
      this.ads = this.adsClone = data
    })
  }

  getProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data
    })
  }

  dateToString(date: any) {
    return (new Date(date)).toLocaleDateString()
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.searchWordsFilterValue.push(value);
    }

    event.chipInput!.clear();

    this.filter()
  }

  remove(searchWord: string): void {
    const index = this.searchWordsFilterValue.indexOf(searchWord);

    if (index >= 0) {
      this.searchWordsFilterValue.splice(index, 1);
    }

    this.filter()
  }

  searchWordFilter(ad: Ad) {
    if(this.searchWordsFilterValue.length == 0) return true

    let found = false

    this.searchWordsFilterValue.forEach((searchWord: any) => {
      if(
        ad.info.includes(searchWord) ||
        ad.discountType.toString().concat('%').includes(searchWord) ||
        this.dateToString(ad.startDate).includes(searchWord) ||
        this.dateToString(ad.endDate).includes(searchWord) ||
        ad.products.filter((product: any) => product.name.includes(searchWord)).length > 0) {
          found = true
        }
    })

    return found
  }

  productsFilter(ad: any) {
    if (this.selectedProductsFilterValue.length == 0) return true

    let found = false

    console.log('here')

    this.selectedProductsFilterValue.forEach((product: any) => {
      if(ad.products.filter((adProduct: any) => adProduct._id == product._id).length > 0) found = true
    });
    
    return found
  }

  discountFilter(ad: Ad) {
    if(this.discountFilterValue < ad.discountType) return true
    return false
  }

  filter() {
    this.ads = this.adsClone.filter(
      (ad: Ad) => 
      this.searchWordFilter(ad) &&
      this.productsFilter(ad) &&
      this.discountFilter(ad)
    )
  }

  formatLabel(value: number) {
    return value + '%'
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
