import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { BillingStmtRoutingModule } from './billing-stmt-routing.module';
import { BillingStmtComponent } from './billing-stmt.component';

@NgModule({
  declarations: [BillingStmtComponent],
  imports: [
    SharedModule,
    BillingStmtRoutingModule
  ]
})

export class BillingStmtModule { }