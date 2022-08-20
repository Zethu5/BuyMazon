import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckoutComponent } from '../../checkout/checkout/checkout.component';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {

  orderId: string = ''

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CheckoutComponent>
    ) { }

  ngOnInit(): void {
    this.orderId = this.data.order_id
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
