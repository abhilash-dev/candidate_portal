import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service"
import { Router, ActivatedRoute, Params } from "@angular/router"
import { FlashMessagesService } from "angular2-flash-messages"
import { User } from "../../models/user"
import { Employment } from "../../models/employment"
import { EmploymentEntry } from '../../models/employment-entry'


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user_id: string
  user: User
  editUser: boolean = false
  employment: EmploymentEntry


  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private flashMessageService: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.user_id = this.route.snapshot.params['id'];
    this.userService.getUser(this.user_id).subscribe((user) => this.user = user);
  }

  onEdit() {
    this.editUser = !this.editUser
  }

  onDelete() {
    if (confirm('Are you sure?')) {
      this.userService.deleteUser(this.user);
      this.flashMessageService.show("User deleted successfully!", {
        cssClass: 'alert-Success', timeout: 4000
      })

      this.router.navigateByUrl("/")
    }
  }

  onAddNewEmployment() {
    this.employment = new EmploymentEntry();
    this.user.employment_history.push(this.employment);
  }

  onDeleteEmployment(index: number) {
    this.user.employment_history.splice(index);
  }

  onSubmit() {
    this.userService.updateUser(this.user);

    this.flashMessageService.show("User updated successfully!", {
      cssClass: 'alert-Success', timeout: 4000
    })

    this.router.navigateByUrl("/")
  }

}
