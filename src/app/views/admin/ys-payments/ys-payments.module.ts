import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsPaymentsRoutingModule } from './ys-payments-routing.module';
import { YsPaymentsComponent } from './ys-payments.component';

@NgModule({
  declarations: [YsPaymentsComponent],
  imports: [
    SharedModule,
    YsPaymentsRoutingModule
  ]
})

export class YsPaymentsModule { }