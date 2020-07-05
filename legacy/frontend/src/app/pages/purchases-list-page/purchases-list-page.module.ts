import { NgModule } from '@angular/core';

import { PurchasesListPageRoutingModule } from './purchases-list-page-routing.module';
import { PurchasesListPageComponent } from './purchases-list-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [PurchasesListPageComponent],
  imports: [
    SharedModule,
    PurchasesListPageRoutingModule
  ]
})
export class PurchasesListPageModule { }
