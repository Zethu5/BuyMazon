import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from 'src/app/services/product/product.service';
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
  private dialogRef: MatDialogRef<ProductsComponent>) { }

  ngOnInit(): void {
    this.product = this.data.product
  }

  deleteProduct() {
    this.productService.deleteProduct(this.product._id)
    this.dialogRef.close({event: 'Deleted'})
  }
}
