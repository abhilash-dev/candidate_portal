import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserComponent } from "./components/add-user/add-user.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { LoginComponent } from "./components/login/login.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { NotFoundComponent } from "./components/not-found/not-found.component"
import { RegisterComponent } from "./components/register/register.component"
import { UserDetailsComponent } from "./components/user-details/user-details.component"

import { AuthGuard } from "./guard/auth.guard"


const routes: Routes = [
  { path: "", component: DashboardComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "user/add", component: AddUserComponent, canActivate: [AuthGuard] },
  { path: "user/:id", component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
