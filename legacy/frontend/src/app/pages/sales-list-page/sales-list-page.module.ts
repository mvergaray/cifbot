import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesListPageRoutingModule } from './sales-list-page-routing.module';
import { SalesListPageComponent } from './sales-list-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [SalesListPageComponent],
  imports: [
    SharedModule,
    SalesListPageRoutingModule
  ]
})
export class SalesListPageModule { }
