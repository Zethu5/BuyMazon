import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Product } from 'src/app/models/product';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductsComponent } from '../../products/products/products.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css']
})
export class CreateProductComponent implements OnInit {

  createProductForm!: FormGroup
  manufacturers!: any

  countries: String[] = [
    'AF', 'AX', 'AL', 'DZ', 'AS', 'AD', 'AO', 'AI', 'AQ', 'AG', 'AR',
    'AM', 'AW', 'AU', 'AT', 'AZ', 'BH', 'BS', 'BD', 'BB', 'BY', 'BE',
    'BZ', 'BJ', 'BM', 'BT', 'BO', 'BQ', 'BA', 'BW', 'BV', 'BR', 'IO',
    'BN', 'BG', 'BF', 'BI', 'KH', 'CM', 'CA', 'CV', 'KY', 'CF', 'TD',
    'CL', 'CN', 'CX', 'CC', 'CO', 'KM', 'CG', 'CD', 'CK', 'CR', 'CI',
    'HR', 'CU', 'CW', 'CY', 'CZ', 'DK', 'DJ', 'DM', 'DO', 'EC', 'EG',
    'SV', 'GQ', 'ER', 'EE', 'ET', 'FK', 'FO', 'FJ', 'FI', 'FR', 'GF',
    'PF', 'TF', 'GA', 'GM', 'GE', 'DE', 'GH', 'GI', 'GR', 'GL', 'GD',
    'GP', 'GU', 'GT', 'GG', 'GN', 'GW', 'GY', 'HT', 'HM', 'VA', 'HN',
    'HK', 'HU', 'IS', 'IN', 'ID', 'IR', 'IQ', 'IE', 'IM', 'IL', 'IT',
    'JM', 'JP', 'JE', 'JO', 'KZ', 'KE', 'KI', 'KP', 'KR', 'KW', 'KG',
    'LA', 'LV', 'LB', 'LS', 'LR', 'LY', 'LI', 'LT', 'LU', 'MO', 'MK',
    'MG', 'MW', 'MY', 'MV', 'ML', 'MT', 'MH', 'MQ', 'MR', 'MU', 'YT',
    'MX', 'FM', 'MD', 'MC', 'MN', 'ME', 'MS', 'MA', 'MZ', 'MM', 'NA',
    'NR', 'NP', 'NL', 'NC', 'NZ', 'NI', 'NE', 'NG', 'NU', 'NF', 'MP',
    'NO', 'OM', 'PK', 'PW', 'PS', 'PA', 'PG', 'PY', 'PE', 'PH', 'PN',
    'PL', 'PT', 'PR', 'QA', 'RE', 'RO', 'RU', 'RW', 'BL', 'SH', 'KN',
    'LC', 'MF', 'PM', 'VC', 'WS', 'SM', 'ST', 'SA', 'SN', 'RS', 'SC',
    'SL', 'SG', 'SX', 'SK', 'SI', 'SB', 'SO', 'ZA', 'GS', 'SS', 'ES',
    'LK', 'SD', 'SR', 'SJ', 'SZ', 'SE', 'CH', 'SY','TW','TJ','TZ','TH',
    'TL','TG','TK','TO','TT','TN','TR','TM','TC','TV','UG','UA','AE','GB',
    'US','UM','UY','UZ','VU','VE','VN','VG','VI','WF','EH','YE','ZM','ZW'
  ]

  weightUnits: String[] = [
    'Mg',
    'G',
    'Kg',
    'L'
  ]

  constructor(private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductsComponent>,
    ) { }

  ngOnInit(): void {
    this.createProductForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      picture: [null, [Validators.required, this.isImageURI]],
      code: [null, [Validators.required, this.isCode]],
      price: [null, [Validators.required, this.isPositiveNumber]],
      weight: [null, [Validators.required, this.isPositiveNumber]],
      weightUnit: [null, [Validators.required]],
      ingredients: [null, [Validators.required]],
      productionCountry: [null, [Validators.required]],
      manufacturer: [null, [Validators.required]],
    })

    this.manufacturerService.getManufacturers().subscribe(data => {
      this.manufacturers = data
    })
  }

  isImageURI(control: AbstractControl) {
    let imageRegex = /(https?:\/\/.*\.(?:png|jpg))/i
    if (!imageRegex.test(control.value)) {
      return { invalidImageURI: true }
    }
    return null
  }

  isCode(control: AbstractControl) {
    let numberRegex = /^[a-zA-Z0-9]{10,20}$/i
    if (!numberRegex.test(control.value)) {
      return { invalidCode: true }
    }
    return null
  }

  isPositiveNumber(control: AbstractControl) {
    if (control.value <= 0) {
      return { invalidWeight: true }
    }
    return null
  }

  onProductSubmit() {
    if(!this.createProductForm.valid) return

    let product: Product = {
      name: this.createProductForm.controls['name'].value,
      picture: this.createProductForm.controls['picture'].value,
      code: this.createProductForm.controls['code'].value,
      price: this.createProductForm.controls['price'].value,
      weight: this.createProductForm.controls['weight'].value,
      weightUnit: this.createProductForm.controls['weightUnit'].value,
      ingredients: this.createProductForm.controls['ingredients'].value,
      productionCountry: this.createProductForm.controls['productionCountry'].value,
      manufacturer: this.createProductForm.controls['manufacturer'].value,
    }

    this.productService.createProduct(product)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
