import { Component, OnInit, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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

  constructor(private fb: FormBuilder) { }

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
}
