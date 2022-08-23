import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom, map } from 'rxjs';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css']
})
export class AdminConsoleComponent implements OnInit {

  users!: any

  constructor(
    private userService: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
    if (!this.userService.isAdmin()) this.router.navigate(['/'])
    this.getUsers()
  }

  getUsers() {
    this.userService.getUsers().subscribe((userData: any) => {
      this.users = userData
    })
  }

  isUserAdmin(userToCheck: any) {
    return this.users.filter((user: any) => user._id == userToCheck._id)[0].isAdmin
  }

  isItMe(username: string) {
    return (this.userService.getLocalStorageUserName() == username ? true : false)
  }

  changeUserAdminStatus(user: any) {
    user.isAdmin = !user.isAdmin
    this.userService.updateUser(user._id, user)
  }
}
