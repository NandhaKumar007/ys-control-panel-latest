import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { YsInactivePaymentsRoutingModule } from './ys-inactive-payments-routing.module';
import { YsInactivePaymentsComponent } from './ys-inactive-payments.component';

@NgModule({
  declarations: [YsInactivePaymentsComponent],
  imports: [
    SharedModule,
    YsInactivePaymentsRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class YsInactivePaymentsModule { }