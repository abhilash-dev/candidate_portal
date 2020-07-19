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
    this.userService.getUsers().subscribe(users => this.users = this.unfiltered_users = users);
  };

  filter(term: string) {
    this.users = this.unfiltered_users.filter(user => user.name.startsWith(term));
  }

}