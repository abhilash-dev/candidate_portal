import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import { FlashMessagesService } from "angular2-flash-messages"

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean
  currentUser: string

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessageService: FlashMessagesService
  ) { }

  ngOnInit(): void {
    // check if the user is already authenticated, If yes set the local state properties
    this.authService.checkUserAuthState().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true
        this.currentUser = auth.email;
      } else {
        this.isLoggedIn = false;
      }
    })
  }

  onLogout() {
    // invoke fireAuth logout 
    this.authService.logout();
    // show success toast to user
    this.flashMessageService.show("Logging you out...", { cssClass: "alert-success", timeout: 3000 })
    // redirect the user to login page
    this.router.navigateByUrl("/login");
  }

}
