import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/pages/inicio/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'vista-previa',
        loadComponent: () =>
          import('src/app/pages/vista-previa/vista-previa.component').then(
            (m) => m.VistaPreviaComponent
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsRoutingModule {}
