import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Ad } from 'src/app/models/ad';
import { AdService } from 'src/app/services/ad/ad.service';
import { ProductService } from 'src/app/services/product/product.service';
import { AdsComponent } from '../../ads/ads/ads.component';


@Component({
  selector: 'app-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  createAdForm!: FormGroup
  socket!: any
  products!: any
  selectedProducts!: any
  discountTypes: number[] = [10,20,30,40,50,60,70,80,90]

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
  }

  getProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data
    })
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
