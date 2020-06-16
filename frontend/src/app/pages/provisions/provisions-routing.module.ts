import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProvisionsComponent } from './provisions.component';
import { ProvisionFormComponent } from './provision-form/provision-form.component';

const routes: Routes = [
  {
    path:'',
    component:ProvisionsComponent,
    data:{
      shouldReuse:false,
      key: 'provisiones'
    }
  },

  {
    path: 'new',
    component: ProvisionFormComponent,
    data: { title: 'Registrar provisión', isChild: true },
  },

  {
    path: 'edit/:id',
    component: ProvisionFormComponent,
    data: { title: 'Editar provisión', isChild: true },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProvisionsRoutingModule { }
