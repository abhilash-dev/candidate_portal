import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import { FlashMessagesService } from "angular2-flash-messages"

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string
  password: string

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessageService: FlashMessagesService
  ) { }

  ngOnInit(): void {
    // check if the user is already authenticated, If yes redirect to dashboard
    this.authService.checkUserAuthState().subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl("/");
      }
    })
  }

  onSubmit() {
    // invoke the fireAuth service for login with user provided credentials
    this.authService.login(this.email, this.password)
      .then(res => {
        // on success, redirect user to dashboard
        this.router.navigateByUrl("/");
        // show success toast to user
        this.flashMessageService.show("You've successfully logged In", { cssClass: "alert-success", timeout: 3000 })
      }).catch(err => {
        // on failure, dispaly a failure toast to user
        this.flashMessageService.show(`Error - ${err}`, { cssClass: "alert-success", timeout: 3000 })
      })
  }
}
