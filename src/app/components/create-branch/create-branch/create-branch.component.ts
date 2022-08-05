import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { BranchesComponent } from '../../branches/branches/branches.component';

@Component({
  selector: 'app-create-branch',
  templateUrl: './create-branch.component.html',
  styleUrls: ['./create-branch.component.css']
})
export class CreateBranchComponent implements OnInit {

  createBranchForm!: FormGroup
  branches!: any
  cities = [
    'ירושלים',
    'תל אביב',
    'חיפה',
    'ראשון לציון',
    'פתח תקווה',
    'אשדוד',
    'נתניה',
    'באר שבע',
    'בני ברק',
    'חולון',
    'רמת גן',
    'אשקלון',
    'רחובות',
    'בית שמש',
    'בת ים',
    'כפר סבא',
    'הרצליה',
    'חדרה',
    'מודיעין-מכבים-רעות',
    'לוד'
  ]

  constructor(private fb: FormBuilder,
    private branchService: BranchService,
    private dialogRef: MatDialogRef<BranchesComponent>,
  ) { }

  ngOnInit(): void {
    this.createBranchForm = this.fb.group({
      city: [null, [Validators.required]],
      address: [null, [Validators.required]],
      phone: [null, [Validators.required, this.isPhone]],
      picture: [null, [Validators.required, this.isImageURI]],
    })
    
    this.getBranches()
  }

  getBranches() {
    this.branchService.getBranchs().subscribe(data => {
      this.branches = data
    })
  }

  isImageURI(control: AbstractControl) {
    let imageRegex = /(https?:\/\/.*\.(?:png|jpg))/i
    if (!imageRegex.test(control.value)) {
      return { invalidImageURI: true }
    }
    return null
  }

  isPhone(control: AbstractControl) {
    let phoneRegex = /^0[1-9]\-\d{7}$/

    if (!phoneRegex.test(control.value)) {
      return { invalidPhoneNumber: true }
    }
    return null
  }

  onBranchSubmit() {
    if(!this.createBranchForm.valid) return

    let branch: Branch = {
      city: this.createBranchForm.controls['city'].value,
      address: this.createBranchForm.controls['address'].value,
      phone: this.createBranchForm.controls['phone'].value,
      picture: this.createBranchForm.controls['picture'].value,
    }

    this.branchService.createBranch(branch)
  }

  closeDialog() {
    this.dialogRef.close()
  }
}
