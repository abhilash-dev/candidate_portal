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
    this.authService.logout();
    this.flashMessageService.show("Logging you out...", { cssClass: "alert-success", timeout: 3000 })
    this.router.navigateByUrl("/login");
  }

}
