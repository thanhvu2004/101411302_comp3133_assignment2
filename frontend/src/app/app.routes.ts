import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeFormComponent } from './employeeform/employeeform.component';
import { EmployeedetailsComponent } from './employeedetails/employeedetails.component';
import { AuthGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';

export const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [GuestGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'create', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'edit/:id', component: EmployeeFormComponent, canActivate: [AuthGuard] },
  { path: 'details/:id', component: EmployeedetailsComponent, canActivate: [AuthGuard] },
];