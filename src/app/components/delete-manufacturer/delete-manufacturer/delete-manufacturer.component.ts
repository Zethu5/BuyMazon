import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  private dialogRef: MatDialogRef<ManufacturersComponent>) { }

  ngOnInit(): void {
    this.manufacturer = this.data.manufacturer
  }

  deleteManufacturer() {
    this.productService.getProducts().subscribe((productData: any) => {
      this.userService.getUsers().subscribe((userData: any) => {
        let manufacturerProductsIds: any = []

        // get manufacturer products first
        productData.forEach((element: any) => {
          if(element.manufacturer._id.toString() == this.manufacturer._id.toString()) {
            manufacturerProductsIds.push(element._id)
          }
        })

        // clear carts of products of manufacturer
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

        // delete manufacturer products
        manufacturerProductsIds.forEach((element: any) => {
            this.productService.deleteProduct(element)
        })


        // // delete manufacturer
        this.manufacturerService.deleteManufacturer(this.manufacturer._id)
        this.dialogRef.close({event: 'Deleted'})
      })
    })
  }
}
