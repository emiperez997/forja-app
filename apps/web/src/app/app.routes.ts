import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then((m) => m.RegisterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/workspace/workspace').then((m) => m.WorkspaceComponent),
  },
  {
    path: 'trash',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/trash/trash').then((m) => m.TrashComponent),
  },
];
