import { NgModule } from '@angular/core';

import { PaymentFormPageRoutingModule } from './payment-form-page-routing.module';
import { PaymentFormPageComponent } from './payment-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    PaymentFormPageComponent
  ],
  imports: [
    SharedModule,
    PaymentFormPageRoutingModule
  ]
})
export class PaymentFormPageModule { }
