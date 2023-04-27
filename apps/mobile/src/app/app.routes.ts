import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeComponentModule),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
