import { Component, Inject, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { CreateManufacturerComponent } from '../../create-manufacturer/create-manufacturer/create-manufacturer.component';
import { Manufacturer } from 'src/app/models/manufacturer';
import { DeleteManufacturerComponent } from '../../delete-manufacturer/delete-manufacturer/delete-manufacturer.component';
import { UpdateManufacturerComponent } from '../../update-manufacturer/update-manufacturer/update-manufacturer.component';
import { socket_connection } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manufacturers',
  templateUrl: './manufacturers.component.html',
  styleUrls: ['./manufacturers.component.css']
})
export class ManufacturersComponent implements OnInit {

  manufacturers!: any
  manufacturersClone!: any
  searchField!: any
  socket!: any

  constructor(
    private manufacturerService: ManufacturerService, 
    private userService: UserService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    if (!this.userService.isAdmin()) this.router.navigate(['/'])

    this.manufacturerService.getManufacturers().subscribe(data => {
      this.manufacturersClone = this.manufacturers = data
      this.setManufacturerNumProducts()
      this.searchField = ''
    })
    this.updateManufacturers()
  }

  updateManufacturers() {
    this.socket = io.io(socket_connection)
    this.socket.on('manufacturerUpdate', () => {
      this.manufacturerService.getManufacturers().subscribe(data => {
        this.manufacturersClone = data
        this.setManufacturerNumProducts()
        this.search()
      })
    })
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateManufacturerComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit()
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
        this.ngOnInit()
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
        this.ngOnInit()
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
      this.manufacturers = this.manufacturersClone.filter(
        (manufacturer: Manufacturer) => 
        this.searchFilter(
          manufacturer, this.searchField.toLowerCase()
        )
      )
    } else {
      this.manufacturers = this.manufacturersClone
    }
  }

  setManufacturerNumProducts() {
    this.manufacturers.forEach((manufacturer: any) => {
      this.manufacturerService
      .getManufacturerSumProducts(manufacturer._id)
      .subscribe((sum) => {manufacturer.sum_products = sum})
    });
  }
}