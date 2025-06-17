import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RoleGuard } from '../core/guard/auth.guard';
import { UserEditComponent } from './pages/user/user-edit/user-edit.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'panel',
        loadComponent: () =>
          import(
            'src/app/layouts-dash/pages/dashboard/dashboard.component'
          ).then((m) => m.DashboardComponent),
        canActivate: [RoleGuard],
      },

      {
        path: 'pedidos',
        loadComponent: () =>
          import('src/app/layouts-dash/pages/pedidos/pedidos.component').then(
            (m) => m.PedidosComponent
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('src/app/layouts-dash/pages/user/user.component').then(
            (m) => m.UserComponent
          ),
        canActivate: [RoleGuard],
      },
      {
        path: 'usuarios/:id/editar',
        loadComponent: () =>
          import(
            'src/app/layouts-dash/pages/user/user-edit/user-edit.component'
          ).then((m) => m.UserEditComponent),
        canActivate: [RoleGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsDashRoutingModule {}
