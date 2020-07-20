import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service"
import { Router, ActivatedRoute, Params } from "@angular/router"
import { FlashMessagesService } from "angular2-flash-messages"
import { User } from "../../models/user"
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
    // fetch the user id from the URL
    this.user_id = this.route.snapshot.params['id'];
    // fetch the user from firestore using user_id
    this.userService.getUser(this.user_id).subscribe((user) => this.user = user);
  }

  // toggle the form editable property on click
  onEdit() {
    this.editUser = !this.editUser
  }

  // on delete a user
  onDelete() {
    // confirm the deletion
    if (confirm('Are you sure?')) {
      // if yes, invoke the service method to remove the user
      this.userService.deleteUser(this.user);
      // show the success toast to user for deletion
      this.flashMessageService.show("User deleted successfully!", {
        cssClass: 'alert-success', timeout: 4000
      })
      // redirect the user to dashboard
      this.router.navigateByUrl("/")
    }
  }

  // add a new employment form entry
  onAddNewEmployment() {
    this.employment = new EmploymentEntry();
    this.user.employment_history.push(this.employment);
  }

  // remove the given employment form entry
  onDeleteEmployment(index: number) {
    this.user.employment_history.splice(index);
  }

  onSubmit() {
    // invoke the update service for the given user
    this.userService.updateUser(this.user);
    // show success toast to the user
    this.flashMessageService.show("User updated successfully!", {
      cssClass: 'alert-success', timeout: 4000
    })
    // redirect the user to dashboard after update
    this.router.navigateByUrl("/")
  }
}
