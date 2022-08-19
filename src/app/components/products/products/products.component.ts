import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product/product.service';
import { CreateProductComponent } from '../../create-product/create-product/create-product.component';
import { DeleteProductComponent } from '../../delete-product/delete-product/delete-product.component';
import { UpdateProductComponent } from '../../update-product/update-product/update-product.component';
import { socket_connection } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/services/user/user.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { AdService } from 'src/app/services/ad/ad.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products!: any
  productsClone!: any
  searchField!: any
  socket!: any
  manufacturers!: any
  productionCountries!: any
  minProductPrice!: any
  maxProductPrice!: any
  manufacturerFilterValue!: any
  productionCountryFilterValue!: any
  priceFilterValue!: any
  activeAds!: any

  constructor(private productService: ProductService,
    private userService: UserService,
    private cartService: CartService,
    private manufacturerService: ManufacturerService,
    private adService: AdService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: any) => {
      this.products = this.productsClone = data
      this.getManufacturers()
      this.getProductsProductionCountries()
      this.minProductPrice = this.getProductsMinValue()
      this.maxProductPrice = this.getProductsMaxValue()
      this.getActiveAds()
    })

    this.updateProducts()
    this.updateAds()
  }

  getActiveAds() {
    this.adService.getActiveAds().subscribe((activeAds: any) => {
      this.activeAds = activeAds
    })
  }

  isProductInActiveAd(product: any) {
    return this.activeAds
      .filter((activeAd: any) => 
        activeAd.products
          .map((product: any) => product._id)
            .includes(product._id)).length > 0
  }

  getAdDiscountForProduct(product: any) {
    const adOfProduct = 
    this.activeAds
      .filter((activeAd: any) => 
        activeAd.products
          .map((product: any) => product._id)
            .includes(product._id))[0]

    return adOfProduct.discountType
  }

  getProductPriceAfterDiscount(originalPrice: number, discount: number) {
    return (originalPrice * (1-discount/100)).toFixed(2)
  }

  updateProducts() {
    this.socket = io.io(socket_connection)
    this.socket.on('productUpdate', () => {
      this.productService.getProducts().subscribe((data: any) => {
        this.productsClone = data
        this.search()
      })
    })
  }

  updateAds() {
    this.socket = io.io(socket_connection)
    this.socket.on('adUpdate', () => {
      this.getActiveAds()
    })
  }

  searchFilter(product: Product, search: string): boolean {
    if(search.length > 0) {
      return product.name.toLowerCase().includes(search) ||
      product.picture.toLowerCase().includes(search) ||
      product.code.toLowerCase().includes(search) ||
      product.price.toString().toLowerCase().includes(search) ||
      product.weight.toString().toLowerCase().includes(search) ||
      product.weightUnit.toLowerCase().includes(search) ||
      product.ingredients.toLowerCase().includes(search) ||
      product.productionCountry.toLowerCase().includes(search) ||
      product.manufacturer.name.toLowerCase().includes(search)
    }
    return true
  }

  manufacturerFilter(product: Product): boolean {
    if(!this.manufacturerFilterValue) return true
    if(this.manufacturerFilterValue.length == 0) return true
    return this.manufacturerFilterValue.includes(product.manufacturer.name)
  }

  productionCountryFilter(product: Product): boolean {
    if(!this.productionCountryFilterValue) return true
    if(this.productionCountryFilterValue.length == 0) return true
    return this.productionCountryFilterValue.includes(product.productionCountry)
  }

  priceFilter(product: Product): boolean {
    if(!this.priceFilterValue) return true
    return product.price >= this.priceFilterValue
  }

  search() {
    let searchValue: string = ''
    if (this.searchField) searchValue = this.searchField.toLowerCase()

    this.products = this.productsClone.filter(
      (product: Product) => 
      this.searchFilter(product, searchValue) &&
      this.manufacturerFilter(product) &&
      this.productionCountryFilter(product) &&
      this.priceFilter(product)
    )
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateProductComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.updateProducts()
    });
  }

  openDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(DeleteProductComponent, {
      width: '25rem',
      data: {
        product: product
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateProducts()
    });
  }

  openUpdateDialog(product: Product): void {
    const dialogRef = this.dialog.open(UpdateProductComponent, {
      data: {
        product: product
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.updateProducts()
    });
  }

  isLoggedIn() {
    return this.userService.isLoggedIn()
  }

  isAdmin() {
    return this.userService.isAdmin()
  }

  addProductToUser(product: Product) {
    this.cartService.addProductToUser(product)
  }

  getManufacturers() {
    this.manufacturerService.getManufacturers().subscribe((data: any) => {
      this.manufacturers = data
    })
  }

  getProductsProductionCountries() {
    this.productionCountries = this.primitiveFilterUnique(
      this.products.map((x: any) => x.productionCountry))
  }

  primitiveFilterUnique(array: any) {
    let tempArray: any[] = []
    let uniqueArray: any[] = []

    array.forEach((element: any) => {
      if(!tempArray.includes(element)) {
        uniqueArray.push(element)
        tempArray.push(element)
      }
    });

    return uniqueArray
  }

  getProductsMinValue() {
    return this.getMin(this.productsClone.map((x: any) => Number.parseFloat(x.price)))
  }

  getProductsMaxValue() {
    return this.getMax((this.productsClone.map((x: any) => Number.parseFloat(x.price))))
  }

  formatLabel(value: number) {
    return value
  }

  getMin(array: any) {
    let min = Number.MAX_VALUE

    array.forEach((element: number) => {
      if (element < min) min = element
    });

    return Math.floor(min)
  }

  getMax(array: any) {
    let max = 0

    array.forEach((element: number) => {
      if (element > max) max = element
    });

    return Math.floor(max)
  }

  resetFilters() {
    this.searchField = ''
    this.manufacturerFilterValue = []
    this.productionCountryFilterValue = []
    this.priceFilterValue = this.getProductsMinValue()
    this.search()
  }
}
