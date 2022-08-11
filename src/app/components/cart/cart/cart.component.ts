import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  user!: any
  products: [Product?] = []
  displayedColumns: string[] = ['name', 'picture', 'code', 'price', 'weight', 'manufacturer', 'amount']

  constructor(
    private userService: UserService, 
    private cartService: CartService, 
    private productService: ProductService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.userService.getUserByUsername(this.userService.getLocalStorageUserName()!).subscribe((user: any) => {
      this.user = user
      this.cartService.getUserCartById(this.user._id).subscribe((cart: any) => {
        const cartProductIds = cart.map((x: any) => x._id)
        this.productService.getProducts().subscribe((data: any) => {
          this.products = data.filter((x: any) => cartProductIds.includes(x._id))
          this.products.forEach((element: any) => {
            element.amount = cart.filter((x: any) => element._id === x._id)[0].value
          });
        })
      })
    })
  }

  increaseAmount(product: any) {
    product.amount++
  }

  decreaseAmount(product: any) {
    product.amount--
  }

  getTotalCost() {
    let sum = 0
    this.products.forEach((product: any) => sum += product.amount * product.price)
    return sum.toFixed(2)
  }
}
