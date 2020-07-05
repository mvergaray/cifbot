import { NgModule } from '@angular/core';

import { ManageCompanyRoutingModule } from './manage-company-routing.module';
import { ManageCompanyComponent } from './manage-company.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [ManageCompanyComponent],
  imports: [
    SharedModule,
    ManageCompanyRoutingModule
  ]
})
export class ManageCompanyModule { }
