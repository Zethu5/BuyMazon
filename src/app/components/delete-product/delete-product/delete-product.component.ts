import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { ProductsComponent } from '../../products/products/products.component';

@Component({
  selector: 'app-delete-product',
  templateUrl: './delete-product.component.html',
  styleUrls: ['./delete-product.component.css']
})
export class DeleteProductComponent implements OnInit {

  product!: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private productService: ProductService,
  private userService: UserService,
  private cartService: CartService,
  private adService: AdService,
  private dialogRef: MatDialogRef<ProductsComponent>) { }

  ngOnInit(): void {
    this.product = this.data.product
  }

  deleteProduct() {
    this.userService.getUsers().subscribe((userData: any) => {
      this.adService.getAds().subscribe((adData: any) => {
        // clear carts from the product
        userData.forEach((user: any) => {
          this.cartService.removeBulkProductsFromUser(user, [this.product])
        })

        // clear ads from the product
        adData.forEach((ad: any) => {
          ad.products = ad.products.filter((p: any) => p._id != this.product._id)
          this.adService.updateAd(ad._id, ad)
        })

        // delete product
        this.productService.deleteProduct(this.product._id)
        this.dialogRef.close({event: 'Deleted'})
      })
    })
  }
}
