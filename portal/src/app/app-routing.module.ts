import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUserComponent } from "./components/add-user/add-user.component"
import { DashboardComponent } from "./components/dashboard/dashboard.component"
import { LoginComponent } from "./components/login/login.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { NotFoundComponent } from "./components/not-found/not-found.component"
import { RegisterComponent } from "./components/register/register.component"
import { SidebarComponent } from "./components/sidebar/sidebar.component"
import { UsersComponent } from "./components/users/users.component"
import { UserDetailsComponent } from "./components/user-details/user-details.component"
import { EditUserComponent } from "./components/edit-user/edit-user.component"


const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "user/add", component: AddUserComponent },
  { path: "user/edit/:id", component: EditUserComponent },
  { path: "user/:id", component: UserDetailsComponent },
  { path: "**", component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
