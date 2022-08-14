import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Branch } from 'src/app/models/branch';
import { BranchService } from 'src/app/services/branch/branch.service';
import { socket_connection } from '../../../../environments/environment';
import * as io from 'socket.io-client';
import { CreateBranchComponent } from '../../create-branch/create-branch/create-branch.component';
import { DeleteBranchComponent } from '../../delete-branch/delete-branch/delete-branch.component';
import { UpdateBranchComponent } from '../../update-branch/update-branch/update-branch.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.css']
})
export class BranchesComponent implements OnInit {

  branches!: any
  branchesClone!: any
  searchField!: any
  socket!: any

  constructor(private branchService: BranchService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getBranches()
    this.updateBranches()
  }

  getBranches() {
    this.branchService.getBranches().subscribe(data => {
      this.branches = this.branchesClone = data
    })

    // this.ngOnInit()
  }

  updateBranches() {
    this.socket = io.io(socket_connection)
    this.socket.on('branchUpdate', () => {
      this.branchService.getBranches().subscribe(data => {
        this.branches = this.branchesClone = data
        this.search()
      })
    })
  }

  search() {
    if (this.searchField?.length > 0) {
      this.branches = this.branchesClone.filter(
        (branch: Branch) => 
        this.searchFilter(
          branch, this.searchField.toLowerCase()
        )
      )
    } else {
      this.branches = this.branchesClone
    }
  }

  searchFilter(branch: Branch, search: string): boolean {
    if(search.length > 0) {
      return branch.city.toLowerCase().includes(search) ||
      branch.address.toLowerCase().includes(search) ||
      branch.phone.toLowerCase().includes(search)
    }
    return true
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateBranchComponent);

    dialogRef.afterClosed().subscribe(() => {
      this.socket.emit('branchUpdate')
    });
  }

  openDeleteDialog(branch: Branch): void {
    const dialogRef = this.dialog.open(DeleteBranchComponent, {
      width: '25rem',
      data: {
        branch: branch
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.socket.emit('branchUpdate')
    });
  }

  openUpdateDialog(branch: Branch): void {
    const dialogRef = this.dialog.open(UpdateBranchComponent, {
      data: {
        branch: branch
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.socket.emit('branchUpdate')
    });
  }
}
