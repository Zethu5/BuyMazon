import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
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
  private dialogRef: MatDialogRef<ManufacturersComponent>) { }

  ngOnInit(): void {
    this.manufacturer = this.data.manufacturer
  }

  deleteManufacturer() {
    this.manufacturerService.deleteManufacturer(this.manufacturer._id)
    this.dialogRef.close({event: 'Deleted'})
  }
}
