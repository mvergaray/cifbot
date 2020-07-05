import { PaymentFormPageComponent } from './payment-form-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {path:'',component:PaymentFormPageComponent,data:{shouldReuse:false,key:'payment-form'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentFormPageRoutingModule { }
