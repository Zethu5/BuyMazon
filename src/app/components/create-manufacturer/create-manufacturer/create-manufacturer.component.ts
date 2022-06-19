import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Manufacturer } from 'src/app/models/manufacturer';
import { ManufacturerService } from 'src/app/services/manufacturer/manufacturer.service';

@Component({
  selector: 'app-create-manufacturer',
  templateUrl: './create-manufacturer.component.html',
  styleUrls: ['./create-manufacturer.component.css']
})
export class CreateManufacturerComponent implements OnInit {

  createManufacturerForm!: FormGroup
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

  constructor(private fb: FormBuilder, 
    private manufacturerService: ManufacturerService,
    private router: Router) { }

  ngOnInit(): void {
    this.createManufacturerForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      logo: [null, [Validators.required, this.isImageURI]],
      type: [null, [Validators.required]],
      industry: [null, [Validators.required]],
      owner: [null, [Validators.required]],
    })
  }

  isImageURI(control: AbstractControl) {
    let imageRegex = /(https?:\/\/.*\.(?:png|jpg))/i
    if (!imageRegex.test(control.value)) {
      return { invalidImageURI: true }
    }
    return null
  }

  onManufacturerSubmit() {
    if(!this.createManufacturerForm.valid) return

    let manufacturer: Manufacturer = {
      name: this.createManufacturerForm.controls['name'].value,
      logo: this.createManufacturerForm.controls['logo'].value,
      type: this.createManufacturerForm.controls['type'].value,
      industry: this.createManufacturerForm.controls['industry'].value,
      owner: this.createManufacturerForm.controls['owner'].value
    }

    this.manufacturerService.createManufacturer(manufacturer)
    this.router.navigateByUrl('');
  }
}
