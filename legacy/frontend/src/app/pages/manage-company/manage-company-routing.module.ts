import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageCompanyComponent } from './manage-company.component';

const routes: Routes = [ {path:'',component: ManageCompanyComponent,data:{shouldReuse:false,key:'company'}},  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageCompanyRoutingModule { }
