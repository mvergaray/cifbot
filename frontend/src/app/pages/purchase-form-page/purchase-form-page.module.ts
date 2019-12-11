import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseFormPageRoutingModule } from './purchase-form-page-routing.module';
import { PurchaseFormPageComponent } from './purchase-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [PurchaseFormPageComponent],
  imports: [
    SharedModule,
    PurchaseFormPageRoutingModule
  ]
})
export class PurchaseFormPageModule { }
