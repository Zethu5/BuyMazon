import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Manufacturer } from 'src/app/models/manufacturer';
import { Product } from 'src/app/models/product';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductsComponent } from '../../products/products/products.component';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css']
})
export class UpdateProductComponent implements OnInit {

  product!: any
  manufacturers!: any
  updateProductForm!: FormGroup

  countries: String[] = [
    'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda', 'Argentina', 
    'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 
    'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 
    'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso', 'Burundi', 'Côte d\'Ivoire', 'Cabo Verde', 'Cambodia', 
    'Cameroon', 'Canada', 'Central African Republic', 'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 
    'Congo (Congo-Brazzaville)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia (Czech Republic)', 
    'Democratic Republic of the Congo', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 
    'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia', 
    'Eswatini (fmr. "Swaziland")', 'Ethiopia', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 
    'Germany', 'Ghana', 'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 
    'Holy See', 'Honduras', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 
    'Israel', 'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 
    'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 
    'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 
    'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 
    'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar (formerly Burma)', 'Namibia', 'Nauru', 
    'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Korea', 
    'North Macedonia', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Palestine State', 'Panama', 
    'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 
    'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 
    'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 
    'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 
    'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 
    'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 
    'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 
    'United Kingdom', 'United States of America', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 
    'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe' 
  ]

  weightUnits: String[] = [
    'Mg',
    'G',
    'Kg'
  ]  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private manufacturerService: ManufacturerService,
    private productService: ProductService,
    private dialogRef: MatDialogRef<ProductsComponent>,) { }

  ngOnInit(): void {
    this.product = this.data.product

    this.updateProductForm = this.fb.group({
      name: [this.product.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      picture: [this.product.picture, [Validators.required, this.isImageURI]],
      code: [this.product.code, [Validators.required, this.isCode]],
      price: [this.product.price, [Validators.required, this.isPositiveNumber]],
      weight: [this.product.weight, [Validators.required, this.isPositiveNumber]],
      weightUnit: [this.product.weightUnit, [Validators.required]],
      ingredients: [this.product.ingredients, [Validators.required]],
      productionCountry: [this.product.productionCountry, [Validators.required]],
      manufacturer: [null, [Validators.required]],
    })

    this.manufacturerService.getManufacturers().subscribe(data => {
      this.manufacturers = data

      // needs to be the value of this.products or else it won't work...
      this.updateProductForm.controls['manufacturer'].setValue(this.manufacturers.find((x: any) => x._id === this.product.manufacturer._id))
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
    if(!this.updateProductForm.valid) return

    let updatedProduct: Product = {
      name: this.updateProductForm.controls['name'].value,
      picture: this.updateProductForm.controls['picture'].value,
      code: this.updateProductForm.controls['code'].value,
      price: this.updateProductForm.controls['price'].value,
      weight: this.updateProductForm.controls['weight'].value,
      weightUnit: this.updateProductForm.controls['weightUnit'].value,
      ingredients: this.updateProductForm.controls['ingredients'].value,
      productionCountry: this.updateProductForm.controls['productionCountry'].value,
      manufacturer: this.updateProductForm.controls['manufacturer'].value,
    }

    this.productService.updateProduct(this.product._id, updatedProduct)
    this.dialogRef.close({event: 'Updated'})
  }
}
