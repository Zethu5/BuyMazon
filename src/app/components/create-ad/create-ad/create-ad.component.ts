import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';
import { Ad } from 'src/app/models/ad';
import { AdService } from 'src/app/services/ad/ad.service';
import { ProductService } from 'src/app/services/product/product.service';
import { AdsComponent } from '../../ads/ads/ads.component';
import * as io from 'socket.io-client';
import { socket_connection } from 'src/environments/environment';


@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  createAdForm!: FormGroup
  products!: any
  selectedProducts!: any
  discountTypes: number[] = [10,20,30,40,50,60,70,80,90]
  socket!: any

  constructor(
    private fb: FormBuilder,
    private adService: AdService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AdsComponent>) { }

  ngOnInit(): void {
    this.createAdForm = this.fb.group({
      products: [null, [Validators.required]],
      discountType: [null, [Validators.required]],
      info: [null, [Validators.required]],
      startDate: [null, [Validators.required, this.isDateValid]],
      endDate: [null, [Validators.required]],
      active: [false, []],
    })

    this.getProducts()
    this.updateAds()
  }

  getProducts() {
    this.productService.getProducts().subscribe((productsData: any) => {
      // a product can only be in 1 ad
      this.getProductsNotInAds(productsData).subscribe((prodcutsNotInAdsData) =>{
        this.products = prodcutsNotInAdsData
      })
    })
  }

  updateAds() {
    this.socket = io.io(socket_connection)
    this.socket.on('adUpdate', () => {
      this.getProducts()
    })

    this.socket.on('productUpdate', () => {
      this.getProducts()
    })
  }

  getProductsNotInAds(products: any) {
    let productsIdsInAds: any = []
    return this.adService.getAds().pipe(map((data: any) => {
      data.forEach((ad: any) => {
        ad.products.forEach((product: any) => {
          productsIdsInAds.push(product._id)
        })
      })

      return products.filter((product: any) => !productsIdsInAds.includes(product._id))
    }))
  }

  unselectAll() {
    this.selectedProducts = []
  }

  setFormProductsControl() {
    this.createAdForm.controls['products'].setValue(this.selectedProducts)
  }

  isDateValid(control: AbstractControl) {
    const dateValue = new Date(control.value)
    const nowDateValue = new Date(Date.now())

    if (nowDateValue.getTime() - dateValue.getTime() > 86400000) {
      return { invalidDate: true}
    }
    return null
  }

  isEndDateValid() {
    const startDateValue = new Date(this.createAdForm.controls['startDate'].value)
    const endDateValue = new Date(this.createAdForm.controls['endDate'].value)

    if(endDateValue.getTime() - startDateValue.getTime() < 0) {
      this.createAdForm.controls['endDate'].setErrors({invalidEndDate: true})
    }

    return null
  }


  onAdSubmit() {
    let ad: Ad = {
      products: this.createAdForm.controls['products'].value,
      discountType: this.createAdForm.controls['discountType'].value,
      info: this.createAdForm.controls['info'].value,
      startDate: this.createAdForm.controls['startDate'].value,
      endDate: this.createAdForm.controls['endDate'].value,
      active: this.createAdForm.controls['active'].value
    }

    this.adService.createAd(ad)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
