import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/forgot-password-page/forgot-password-page.component').then(m => m.ForgotPasswordPageComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent),
  },
  {
    path: 'partner',
    loadComponent: () => import('./pages/partner-page/partner-page.component').then(m => m.PartnerPageComponent),
  },
  {
    path: 'become-courier',
    loadComponent: () => import('./pages/become-courier-page/become-courier-page.component').then(m => m.BecomeCourierPageComponent),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
