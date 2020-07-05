import { PurchaseFormPageComponent } from './purchase-form-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path:'',
    component:PurchaseFormPageComponent,
    data:{
      shouldReuse:false,
      key:'purchase-form'
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PurchaseFormPageRoutingModule { }
