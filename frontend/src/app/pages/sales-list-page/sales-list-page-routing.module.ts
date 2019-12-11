import { SalesListPageComponent } from './sales-list-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:SalesListPageComponent,
    data:{
      shouldReuse:false,key:'sales-list'
    }
  },
  {
    path: 'new',
    loadChildren: () =>
        import('../sales-form-page/sales-form-page.module').then(
          m => m.SalesFormPageModule,
      ),
    data: {
      title: 'Registrar comprobante de venta',
      isChild: true,
      shouldReuse: false
    },
  },
  {
    path: 'edit/:id',
    loadChildren: () =>
        import('../sales-form-page/sales-form-page.module').then(
          m => m.SalesFormPageModule,
      ),
    data: {
      title: 'Actualizar comprobante de venta',
      isChild: true,
      shouldReuse: false
    },
  },
  {
    path: ':id/payment',
    loadChildren: () =>
        import('../payment-form-page/payment-form-page.module').then(
          m => m.PaymentFormPageModule,
      ),
    data: {
      title: 'Registrar ingreso de dinero',
      isChild: true,
      shouldReuse: false
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesListPageRoutingModule { }
