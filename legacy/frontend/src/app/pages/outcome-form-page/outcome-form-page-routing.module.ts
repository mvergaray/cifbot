import { OutcomeFormPageComponent } from './outcome-form-page.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [ {path:'',component: OutcomeFormPageComponent,data:{shouldReuse:false,key:'outcome-form'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutcomeFormPageRoutingModule { }
