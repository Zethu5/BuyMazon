import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BranchService } from 'src/app/services/branch/branch.service';
import { BranchesComponent } from '../../branches/branches/branches.component';

@Component({
  selector: 'app-delete-branch',
  templateUrl: './delete-branch.component.html',
  styleUrls: ['./delete-branch.component.css']
})
export class DeleteBranchComponent implements OnInit {

  branch!: any

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, 
  private branchService: BranchService, 
  private dialogRef: MatDialogRef<BranchesComponent>) { }

  ngOnInit(): void {
    this.branch = this.data.branch
  }

  deleteProduct() {
    this.branchService.deleteBranch(this.branch._id)
    this.dialogRef.close({event: 'Deleted'})
  }
}
