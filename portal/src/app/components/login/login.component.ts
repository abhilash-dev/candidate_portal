import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../services/auth.service"
import { Router } from "@angular/router"
import { auth } from 'firebase';

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.checkUserAuthState().subscribe(auth => {
      if (auth) {
        this.router.navigateByUrl("/");
      }
    })
  }

  onSubmit() {
    this.authService.login(this.email, this.password)
      .then(res => {
        this.router.navigateByUrl("/");
      }).catch(err => {
        console.error("Something went wrong!" + err);
      })
  }
}
