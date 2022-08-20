import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { socket_connection } from 'src/environments/environment';
import * as io from 'socket.io-client'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  user!: any
  products: [Product?] = []
  displayedColumns: string[] = [
    'name', 
    'picture', 
    'code', 
    'price', 
    'weight', 
    'manufacturer', 
    'amount'
  ]

  socket!: any

  constructor(
    private userService: UserService, 
    private cartService: CartService, 
    private productService: ProductService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (!this.userService.isLoggedIn()) this.router.navigate(['/'])
    this.getCart()
    this.updateCart()
  }

  getCart() {
    this.userService.getUserByUsername(this.userService.getLocalStorageUserName()!).subscribe((user: any) => {
      this.user = user
      this.cartService.getUserCartById(this.user._id).subscribe((cart: any) => {
        const cartProductIds = cart.map((x: any) => x._id)
        this.productService.getProducts().subscribe((data: any) => {
          this.products = data.filter((x: any) => cartProductIds.includes(x._id))
          this.products.forEach((element: any) => {
            // get amount of times product is in cart
            element.amount = cart.filter((x: any) => element._id === x._id)[0].value

            // change the price of the product in cart if it's in an ad
            let sameProduct = this.user.products.filter(
              (userProduct: any) => userProduct._id == element._id)[0]
              element.price = sameProduct.price
          })
        })
      })
    })
  }

  updateCart() {
    this.socket = io.io(socket_connection)
    this.socket.on('userCartUpdate', () => {
      this.getCart()
    })
  }

  increaseAmount(product: any) {
    product.amount++
    this.cartService.addProductToUser(product)

  }

  decreaseAmount(product: any) {
    product.amount--
    this.cartService.decreaseProductFromUser(product)
  }

  removeProduct(product: any) {
    this.cartService.removeProductFromUser(product)
  }


  getAmountProducts() {
    let total = 0
    this.products.forEach((product: any) => total += product.amount)
    return total
  }

  getTotalCost() {
    let total = 0
    this.products.forEach((product: any) => total += product.amount * product.price)
    return total.toFixed(2)
  }

  getTotalCostToNumber() {
    let total = 0
    this.products.forEach((product: any) => total += product.amount * product.price)
    return Number.parseFloat(total.toFixed(2))
  }

  goToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
