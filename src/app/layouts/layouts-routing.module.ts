import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'success',
        loadComponent: () =>
          import('src/app/shared/components/sucess/sucess.component').then(
            (m) => m.SucessComponent
          )
      },
      {
        path: '',
        loadComponent: () =>
          import('src/app/layouts/pages/inicio/home.component').then(
            (m) => m.HomeComponent
          ),
      },
      {
        path: 'materiales',
        loadComponent: () =>
          import('src/app/layouts/pages/materials/materials.component').then(
            (m) => m.MaterialsComponent
          ),
      },
      {
        path: 'materiales/:slug',
        loadComponent: () =>
          import(
            'src/app/layouts/pages/materials/material-id/material-id.component'
          ).then((m) => m.MaterialIdComponent),
      },
      {
        path: 'vista-previa',
        loadComponent: () =>
          import('src/app/layouts/pages/vista-previa/vista-previa.component').then(
            (m) => m.VistaPreviaComponent
          ),
      },
      {
        path: 'vision',
        loadComponent: () =>
          import('src/app/layouts/pages/vision/vision.component').then(
            (m) => m.VisionComponent
          ),
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsRoutingModule {}
