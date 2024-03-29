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
import { UserService } from 'src/app/services/user/user.service';
import { Emit, Trie } from '@tanishiking/aho-corasick';

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
  discountFilterValue: any = 0
  searchWordsFilterValue: any = []
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  constructor(
    private adService: AdService, 
    private productService: ProductService,
    private userService: UserService,
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

  isAdActive(ad: any) {
    const nowTime = (new Date).getTime()

    return ad.active &&
    (new Date(ad.startDate).getTime() <= nowTime) &&
    (new Date(ad.endDate).getTime() >= nowTime)
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
      // aho corasick algorithm package use
      const trie = new Trie(this.searchWordsFilterValue)
      const emits: Emit[] = trie.parseText(
        ad.info + " " +
        ad.discountType.toString().concat('%')  + " " +
        this.dateToString(ad.startDate) + " " + 
        this.dateToString(ad.endDate) + " " +
        ad.products.map((product: any) => " " + product.name))
      return (emits.length > 0 ? true : false)
  }

  productsFilter(ad: any) {
    if (this.selectedProductsFilterValue.length == 0) return true

    let found = false

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

  isAdmin() {
    return this.userService.isAdmin()
  }

  updateAds() {
    this.socket = io.io(socket_connection)
    this.socket.on('adUpdate', () => {
      this.getAds()
    })
  }

  resetFilters() {
    this.selectedProductsFilterValue = []
    this.discountFilterValue = 0
    this.searchWordsFilterValue = []
    this.filter()
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
