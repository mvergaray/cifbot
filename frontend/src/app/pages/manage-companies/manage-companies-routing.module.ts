import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCompaniesComponent } from './manage-companies.component';

const routes: Routes = [
  {
    path:'',component:ManageCompaniesComponent,
    data: {
      shouldReuse:false, key:'companies'
    }
  },
  {
    path: 'new',
    loadChildren: () =>
        import('../manage-company/manage-company.module').then(
          m => m.ManageCompanyModule,
      ),
    data: {
      title: 'Registrar empresa',
      isChild: true,
      shouldReuse: false
    },
  },
  {
    path: 'edit/:id',
    loadChildren: () =>
        import('../manage-company/manage-company.module').then(
          m => m.ManageCompanyModule,
      ),
    data: {
      title: 'Actualizar empresa',
      isChild: true,
      shouldReuse: false
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCompaniesRoutingModule { }
