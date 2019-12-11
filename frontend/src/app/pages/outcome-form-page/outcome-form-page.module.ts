import { NgModule } from '@angular/core';

import { OutcomeFormPageRoutingModule } from './outcome-form-page-routing.module';
import { OutcomeFormPageComponent } from './outcome-form-page.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [
    OutcomeFormPageComponent
  ],
  imports: [
    SharedModule,
    OutcomeFormPageRoutingModule
  ]
})
export class OutcomeFormPageModule { }
