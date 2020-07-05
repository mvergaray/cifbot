import { PurchasesListPageComponent } from './purchases-list-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'',component:PurchasesListPageComponent,data:{shouldReuse:false,key:'purchases-list'}},
  {
    path: 'new',
    loadChildren: () =>
        import('../purchase-form-page/purchase-form-page.module').then(
          m => m.PurchaseFormPageModule,
      ),
    data: { title: 'Registrar comprobante de compra', isChild: true },
  },
  {
    path: 'payment',
    loadChildren: () =>
        import('../payment-form-page/payment-form-page.module').then(
          m => m.PaymentFormPageModule,
      ),
    data: { title: 'Registrar movimientos', isChild: true },
  },
  {
    path: 'edit/:id',
    loadChildren: () =>
        import('../purchase-form-page/purchase-form-page.module').then(
          m => m.PurchaseFormPageModule,
      ),
    data: {
      title: 'Actualizar comprobante de compra',
      isChild: true,
      shouldReuse: false
    },
  },
  {
    path: ':id/outcome',
    loadChildren: () =>
        import('../outcome-form-page/outcome-form-page.module').then(
          m => m.OutcomeFormPageModule,
      ),
    data: {
      title: 'Registrar salida de dinero',
      isChild: true,
      shouldReuse: false
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchasesListPageRoutingModule { }
