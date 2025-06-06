import { Route } from '@angular/router';
import { authGuard, NoLoginGuard, RoleGuard } from './core/guard/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/layouts/layouts.module').then((m) => m.LayoutsModule),
  },

  /*Rutas Auth*/
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [NoLoginGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('src/app/pages/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  {
    path: 'dashboard',
    loadComponent: () =>
      import('src/app/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard, RoleGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
