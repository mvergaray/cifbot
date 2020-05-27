import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseFormPageRoutingModule } from './purchase-form-page-routing.module';
import { PurchaseFormPageComponent } from './purchase-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';
import { CreateProviderDialog } from './create-provider/create-provider-dialog.component';

@NgModule({
  declarations: [
    CreateProviderDialog,
    PurchaseFormPageComponent
  ],

  entryComponents: [
    CreateProviderDialog,
  ],
  imports: [
    SharedModule,
    PurchaseFormPageRoutingModule
  ]
})
export class PurchaseFormPageModule { }
