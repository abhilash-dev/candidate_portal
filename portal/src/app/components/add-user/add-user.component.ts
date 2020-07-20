import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../models/user'
import { EmploymentEntry } from '../../models/employment-entry'
import { Employment } from '../../models/employment'
import { FlashMessagesService } from "angular2-flash-messages"
import { Router } from "@angular/router"
import { UserService } from "../../services/user.service"

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {
  @ViewChild('userForm') form

  user: User = {
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    age: 0,
    experience: 0,
  }

  employment: EmploymentEntry = new EmploymentEntry()

  employment_history: Employment[] = []

  constructor(
    private flashMessageService: FlashMessagesService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.employment = new EmploymentEntry();
    this.employment_history.push(this.employment);
  }

  // adds a new employment form entry
  onAddNewEmployment() {
    this.employment = new EmploymentEntry();
    this.employment_history.push(this.employment);
  }

  // removes employment form entry given the index
  onDelete(index: number) {
    this.employment_history.splice(index);
  }

  onSubmit(form) {
    // check if the form is valid
    if (!form.valid) {
      // show a error toast to user if something went wrong
      this.flashMessageService.show("Please fill out the form without errors!", {
        cssClass: 'alert-danger', timeout: 4000
      })
      return;
    } else {
      // add user to firestore
      this.userService.addNewUser(this.user, this.employment_history);

      // show success toast to user
      this.flashMessageService.show("New User added!", {
        cssClass: 'alert-Success', timeout: 4000
      })
      // redirect to home
      this.router.navigateByUrl("/")
    }
  }



}
