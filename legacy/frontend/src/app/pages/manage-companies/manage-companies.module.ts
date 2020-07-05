import { NgModule } from '@angular/core';

import { ManageCompaniesRoutingModule } from './manage-companies-routing.module';
import { ManageCompaniesComponent } from './manage-companies.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [ManageCompaniesComponent],
  imports: [
    SharedModule,
    ManageCompaniesRoutingModule
  ]
})
export class ManageCompaniesModule { }
