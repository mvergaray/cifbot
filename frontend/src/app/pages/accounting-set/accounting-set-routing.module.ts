import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountingSetComponent } from './accounting-set.component';
import { AccountComponent } from './account/account.component';

const routes: Routes = [
  {
    path:'',
    component: AccountingSetComponent,
    data:{
      shouldReuse:false,
      key: 'accounting-set'
    }
  },

  {
    path: 'new',
    component: AccountComponent,
    data: { title: 'Registrar cuenta contable', isChild: true },
  },

  {
    path: 'edit/:id',
    component: AccountComponent,
    data: { title: 'Editar cuenta contable', isChild: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingSetRoutingModule { }
