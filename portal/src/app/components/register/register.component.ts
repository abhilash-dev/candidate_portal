import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import { FlashMessagesService } from "angular2-flash-messages";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string
  password: string

  constructor(
    private router: Router,
    private authService: AuthService,
    private flashMessageService: FlashMessagesService
  ) { }

  ngOnInit(): void {
    this.authService.checkUserAuthState().subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl("/");
      }
    })
  }

  onSubmit() {
    this.authService.register(this.email, this.password)
      .then(res => {
        this.router.navigateByUrl("/");
        this.flashMessageService.show("You've successfully registered", { cssClass: 'alert-success', timeout: 3000 });
      }).catch(err => {
        this.flashMessageService.show(`Something went wrong! - ${err}`, { cssClass: 'alert-danger', timeout: 3000 });
      })
  }
}
