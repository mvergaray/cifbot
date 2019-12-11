import { NgModule } from '@angular/core';

import { SalesFormPageRoutingModule } from './sales-form-page-routing.module';
import { SalesFormPageComponent } from './sales-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    SalesFormPageComponent,
  ],
  imports: [
    SharedModule,
    SalesFormPageRoutingModule
  ]
})
export class SalesFormPageModule { }
