import { Component, Inject, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CreateManufacturerComponent } from '../../create-manufacturer/create-manufacturer/create-manufacturer.component';
import { Manufacturer } from 'src/app/models/manufacturer';
import { DeleteManufacturerComponent } from '../../delete-manufacturer/delete-manufacturer/delete-manufacturer.component';
import { UpdateManufacturerComponent } from '../../update-manufacturer/update-manufacturer/update-manufacturer.component';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {

  manufacturers!: any
  manufacturersClone!: any
  searchField!: any

  constructor(private manufacturerService: ManufacturerService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.updateManufacturers()

    // interval(10 * 1000).subscribe(() => {
    //   this.updateManufacturers()
    // })
  }

  updateManufacturers() {
    this.manufacturerService.getManufacturers().subscribe(data => {
      this.manufacturersClone = this.manufacturers = data
      this.searchField = ''
    })
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateManufacturerComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.updateManufacturers()
    });
  }

  openDeleteDialog(manufacturer: Manufacturer): void {
    const dialogRef = this.dialog.open(DeleteManufacturerComponent, {
      data: {
        manufacturer: manufacturer
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.event == 'Deleted') {
        this.updateManufacturers()
      }
    });
  }

  openUpdateDialog(manufacturer: Manufacturer): void {
    const dialogRef = this.dialog.open(UpdateManufacturerComponent, {
      data: {
        manufacturer: manufacturer
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.event == 'Updated') {
        this.updateManufacturers()
      }
    });
  }

  searchFilter(manufacturer: Manufacturer, search: string): boolean {
    if(search.length > 0) {
      return manufacturer.name.toLowerCase().includes(search) || 
      manufacturer.industry.toLowerCase().includes(search) ||
      manufacturer.owner.toLowerCase().includes(search) ||
      manufacturer.type.toLowerCase().includes(search)
    }
    return true
  }

  search() {
    if (this.searchField.length > 0) {
      this.manufacturers = this.manufacturers.filter(
        (manufacturer: Manufacturer) => 
        this.searchFilter(
          manufacturer, this.searchField.toLowerCase()
        )
      )
    } else {
      this.manufacturers = this.manufacturersClone
    }
  }
}