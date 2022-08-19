import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdService } from 'src/app/services/ad/ad.service';
import { CartService } from 'src/app/services/cart/cart.service';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { ManufacturersComponent } from '../../manufacturers/manufacturers/manufacturers.component';

@Component({
  selector: 'app-delete-manufacturer',
  templateUrl: './delete-manufacturer.component.html',
  styleUrls: ['./delete-manufacturer.component.css']
})
export class DeleteManufacturerComponent implements OnInit {

  manufacturer!: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private manufacturerService: ManufacturerService,
  private productService: ProductService,
  private cartService: CartService,
  private userService: UserService,
  private adService: AdService,
  private dialogRef: MatDialogRef<ManufacturersComponent>) { }

  ngOnInit(): void {
    this.manufacturer = this.data.manufacturer
  }

  deleteManufacturer() {
    this.productService.getProducts().subscribe((productData: any) => {
      this.userService.getUsers().subscribe((userData: any) => {
        this.adService.getAds().subscribe((adData: any) => {
          let manufacturerProductsIds: any = []

          // get manufacturer products first
          productData.forEach((element: any) => {
            if(element.manufacturer._id.toString() == this.manufacturer._id.toString()) {
              manufacturerProductsIds.push(element._id)
            }
          })

          // clear carts from products of manufacturer
          userData.forEach((user: any) => {
            let productsToRemove: any = []
            user.products.forEach((product: any) => {
                if(!productsToRemove.map((p: any) => p._id).includes(product._id) &&
                  manufacturerProductsIds.includes(product._id)) {
                  productsToRemove.push(product)
                }
              })

              this.cartService.removeBulkProductsFromUser(user, productsToRemove)
          })

          // clear ads from products of manufacturer
          adData.forEach((ad: any) => {
            ad.products = ad.products.filter(
              (porduct: any) => !manufacturerProductsIds.includes(porduct._id.toString())
            )

            this.adService.updateAd(ad._id, ad)
          })

          // delete manufacturer products
          manufacturerProductsIds.forEach((element: any) => {
              this.productService.deleteProduct(element)
          })


          // delete manufacturer
          this.manufacturerService.deleteManufacturer(this.manufacturer._id)
          this.dialogRef.close({event: 'Deleted'})
        })
      })
    })
  }
}
