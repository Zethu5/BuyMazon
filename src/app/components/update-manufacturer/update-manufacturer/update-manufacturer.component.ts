import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Manufacturer } from 'src/app/models/manufacturer';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';
import { ManufacturersComponent } from '../../manufacturers/manufacturers/manufacturers.component';

@Component({
  selector: 'app-update-manufacturer',
  templateUrl: './update-manufacturer.component.html',
  styleUrls: ['./update-manufacturer.component.css']
})
export class UpdateManufacturerComponent implements OnInit {

  manufacturer!: any
  updateManufacturerForm!: FormGroup

  companyTypes: String[] = ['GP', 'LP', 'JV', 'LLC', 'C', 'S', 'QSSS']
  industryTypes: String[] = [
    'Agriculture',
    'Basic Metal Production',
    'Chemical Industries',
    'Commerce',
    'Construction',
    'Education',
    'Financial Services',
    'Food',
    'Forestry',
    'Health Services',
    'Hotels',
    'Mining',
    'Mechanical and Electrical Engineering',
    'Media',
    'Oil and Gas Production',
    'Postal and Telecommunications Services',
    'Public Service',
    'Shipping',
    'Textiles',
    'Transport',
    'Transport Equipment Manufacturing',
    'Utilities'
  ]

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private manufacturerService: ManufacturerService, 
  private dialogRef: MatDialogRef<ManufacturersComponent>,
  private fb: FormBuilder) { }

  ngOnInit(): void {
    this.manufacturer = this.data.manufacturer

    this.updateManufacturerForm = this.fb.group({
      name: [this.manufacturer.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      logo: [this.manufacturer.logo, [Validators.required, this.isImageURI]],
      type: [this.manufacturer.type, [Validators.required]],
      industry: [this.manufacturer.industry, [Validators.required]],
      owner: [this.manufacturer.owner, [Validators.required]],
    })
  }

  onManufacturerSubmit() {
    if(!this.updateManufacturerForm.valid) return

    let updatedManufacturer: Manufacturer = {
      name: this.updateManufacturerForm.controls['name'].value,
      logo: this.updateManufacturerForm.controls['logo'].value,
      type: this.updateManufacturerForm.controls['type'].value,
      industry: this.updateManufacturerForm.controls['industry'].value,
      owner: this.updateManufacturerForm.controls['owner'].value
    }

    this.manufacturerService.updateManufacturer(this.manufacturer._id, updatedManufacturer)
    this.dialogRef.close({event: 'Updated'})
  }

  isImageURI(control: AbstractControl) {
    let imageRegex = /(https?:\/\/.*\.(?:png|jpg))/i
    if (!imageRegex.test(control.value)) {
      return { invalidImageURI: true }
    }
    return null
  }
}
