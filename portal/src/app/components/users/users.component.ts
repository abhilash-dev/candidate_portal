import { Component, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { User } from "../../models/user"

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  unfiltered_users: User[]
  users: User[]
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    // initialize all the users from the firestore collection for users
    this.userService.getUsers().subscribe(users => this.users = this.unfiltered_users = users);
  };

  // invoked upon an entry into search bar
  filter(term: string) {
    // filter the user records whose name starts with search term & update the UI
    this.users = this.unfiltered_users.filter(user => user.name.startsWith(term));
  }

}