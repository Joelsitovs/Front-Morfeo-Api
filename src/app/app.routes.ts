import { Route } from '@angular/router';
import { authGuard, NoLoginGuard, RoleGuard } from './core/guard/auth.guard';
import { SucessComponent } from './shared/components/sucess/sucess.component';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('src/app/layouts/layouts.module').then((m) => m.LayoutsModule),
  },
/*  {
    path: 'dashboard',
    loadComponent: () =>
      import('src/app/layouts/pages/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard, RoleGuard],
  },*/
  {
    path:'dashboard',
    loadChildren:()=>
      import('src/app/layouts-dash/layouts-dash.module').then(m=>m.LayoutsDashModule),
    canActivate: [authGuard],
  },

  /*Rutas Auth*/
  {
    path: 'login',
    loadComponent: () =>
      import('src/app/layouts/pages/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [NoLoginGuard],
  },
  {
    path: 'register',
    loadComponent: () =>
      import('src/app/layouts/pages/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },

  /*  {
    path: 'canceled',
    component: CancelPageComponent
  }*/
];
