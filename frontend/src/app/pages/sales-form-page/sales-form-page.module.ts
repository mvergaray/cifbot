import { NgModule } from '@angular/core';

import { SalesFormPageRoutingModule } from './sales-form-page-routing.module';
import { SalesFormPageComponent } from './sales-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';
import { CreateClientDialog } from './create-client/create-client-dialog.component';
import { ConfirmDialog } from '../common/confirmation/confirmation-dialog.component';

@NgModule({
  declarations: [
    CreateClientDialog,
    SalesFormPageComponent,
    ConfirmDialog
  ],
  entryComponents: [
    CreateClientDialog,
    ConfirmDialog
  ],
  imports: [
    SharedModule,
    SalesFormPageRoutingModule
  ]
})
export class SalesFormPageModule { }
