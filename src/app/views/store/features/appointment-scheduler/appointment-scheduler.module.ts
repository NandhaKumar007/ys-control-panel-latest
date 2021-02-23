import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AppointmentSchedulerRoutingModule } from './appointment-scheduler-routing.module';
import { AppointmentSchedulerComponent } from './appointment-scheduler.component';


@NgModule({
  declarations: [AppointmentSchedulerComponent],
  imports: [
    SharedModule,
    AppointmentSchedulerRoutingModule
  ]
})

export class AppointmentSchedulerModule { }