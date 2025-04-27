import { Routes } from '@angular/router';
import { authGuard } from './authentication/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./authentication/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./authentication/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees',
    loadComponent: () => import('./features/employees/employees.component').then(m => m.EmployeesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'employees/:id',
    loadComponent: () => import('./features/employees/employee-detail/employee-detail.component').then(m => m.EmployeeDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'attendance',
    loadComponent: () => import('./features/attendance/attendance.component').then(m => m.AttendanceComponent),
    canActivate: [authGuard]
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/projects/projects.component').then(m => m.ProjectsComponent),
    canActivate: [authGuard]
  }
];
