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

  constructor(private productService: ProductService, private userService: UserService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = this.productsClone = data
    })
    this.updateProducts()
  }

  updateProducts() {
    this.socket = io.io(socket_connection)
    this.socket.on('productUpdate', () => {
      this.productService.getProducts().subscribe(data => {
        this.productsClone = data
        this.search()
      })
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

  search() {
    if (this.searchField.length > 0) {
      this.products = this.productsClone.filter(
        (product: Product) => 
        this.searchFilter(
          product, this.searchField.toLowerCase()
        )
      )
    } else {
      this.products = this.productsClone
    }
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
    this.userService.addProductToUser(product)
  }
}
