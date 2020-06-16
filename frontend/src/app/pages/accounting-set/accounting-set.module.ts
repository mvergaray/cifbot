import { NgModule } from '@angular/core';

import { AccountingSetRoutingModule } from './accounting-set-routing.module';
import { AccountingSetComponent } from './accounting-set.component';
import { AccountComponent } from './account/account.component';
import { SharedModule } from 'src/app/core/shared.module';

@NgModule({
  declarations: [AccountingSetComponent, AccountComponent],
  entryComponents: [AccountComponent],
  imports: [
    SharedModule,
    AccountingSetRoutingModule
  ]
})
export class AccountingSetModule { }
