import { SalesFormPageComponent } from './sales-form-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {path:'',component: SalesFormPageComponent,data:{shouldReuse:false, key:'sales-form'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesFormPageRoutingModule { }
