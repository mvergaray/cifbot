import { NgModule } from '@angular/core';

import { ProvisionsRoutingModule } from './provisions-routing.module';
import { ProvisionsComponent } from './provisions.component';
import { ProvisionFormComponent } from './provision-form/provision-form.component';
import { SharedModule } from 'src/app/core/shared.module';
import { ProvisionDetailDialog } from './provision-form/provision-detail/provision-detail-dialog.component';

@NgModule({
  declarations: [ProvisionsComponent, ProvisionFormComponent, ProvisionDetailDialog],
  entryComponents: [ProvisionFormComponent, ProvisionDetailDialog],
  imports: [
    SharedModule,
    ProvisionsRoutingModule
  ]
})
export class ProvisionsModule { }
