import {
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { BranchesComponent } from '../../branches/branches/branches.component';

@Component({
  selector: 'app-update-branch',
  templateUrl: './update-branch.component.html',
  styleUrls: ['./update-branch.component.css']
})
export class UpdateBranchComponent implements OnInit {

  updateBranchForm!: FormGroup
  branch!: any
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

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private branchService: BranchService,
    private dialogRef: MatDialogRef < BranchesComponent > , ) {}

  ngOnInit(): void {
    this.branch = this.data.branch

    this.updateBranchForm = this.fb.group({
      city: [this.branch.city, [Validators.required]],
      address: [this.branch.address, [Validators.required]],
      phone: [this.branch.phone, [Validators.required, this.isPhone]],
      picture: [this.branch.picture, [Validators.required, this.isImageURI]],
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
    if(!this.updateBranchForm.valid) return

    let updatedBranch: Branch = {
      city: this.updateBranchForm.controls['city'].value,
      address: this.updateBranchForm.controls['address'].value,
      phone: this.updateBranchForm.controls['phone'].value,
      picture: this.updateBranchForm.controls['picture'].value,
    }

    this.branchService.updateBranch(this.branch._id, updatedBranch)

    this.dialogRef.close({
      event: 'Updated'
    })
  }
}
