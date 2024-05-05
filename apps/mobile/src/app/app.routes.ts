import { Route } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeComponentModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then((m) => m.LoginComponentModule),
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then((m) => m.RegisterComponentModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
