import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { ProductService } from 'src/app/services/product/product.service';
import { AdsComponent } from '../../ads/ads/ads.component';

@Component({
  selector: 'app-update-ad',
  templateUrl: './update-ad.component.html',
  styleUrls: ['./update-ad.component.css']
})
export class UpdateAdComponent implements OnInit {

  updateAdForm!: FormGroup
  products!: any
  discountTypes: number[] = [10,20,30,40,50,60,70,80,90]
  selectedProducts!: any

  constructor(
    @Inject(MAT_DIALOG_DATA) public ad: any,
    private fb: FormBuilder,
    private adService: AdService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<AdsComponent>) { }

  ngOnInit(): void {
    this.updateAdForm = this.fb.group({
      products: [this.ad.products, [Validators.required]],
      discountType: [this.ad.discountType, [Validators.required]],
      info: [this.ad.info, [Validators.required]],
      startDate: [this.ad.startDate, [Validators.required, this.isDateValid]],
      endDate: [this.ad.endDate, [Validators.required]],
      active: [this.ad.active, []],
    })

    this.getProducts()
    this.selectedProducts = this.ad.products
  }

  getProducts() {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = data
    })
  }

  unselectAll() {
    this.selectedProducts = []
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
    const startDateValue = new Date(this.updateAdForm.controls['startDate'].value)
    const endDateValue = new Date(this.updateAdForm.controls['endDate'].value)

    if(endDateValue.getTime() - startDateValue.getTime() < 0) {
      this.updateAdForm.controls['endDate'].setErrors({invalidEndDate: true})
    }

    return null
  }

  isProductSelected(product: any) {
    if (this.selectedProducts.find((x: any) => x._id == product._id)) return true
    return false
  }

  updateSelection(event: any) {
    if (event.option._selected) {
      this.selectedProducts.push(event.option._value)
    } else {
      this.selectedProducts = this.selectedProducts.filter((x: any) => x._id != event.option.value._id)
    }

    this.updateAdForm.controls['products'].setValue(this.selectedProducts)
  }

  onAdSubmit() {
    let ad: any = {
      products: this.updateAdForm.controls['products'].value,
      discountType: this.updateAdForm.controls['discountType'].value,
      info: this.updateAdForm.controls['info'].value,
      startDate: this.updateAdForm.controls['startDate'].value,
      endDate: this.updateAdForm.controls['endDate'].value,
      active: this.updateAdForm.controls['active'].value
    }

    this.adService.updateAd(this.ad._id, ad)
  }

  closeDialog() {
    this.dialogRef.close()
  }

}
