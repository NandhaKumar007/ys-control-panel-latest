import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { SharedModule } from '../../../../../shared/shared.module';

import { AppointmentSchedulerEventRoutingModule } from './appointment-scheduler-event-routing.module';
import { AppointmentSchedulerEventComponent } from './appointment-scheduler-event.component';

@NgModule({
  declarations: [AppointmentSchedulerEventComponent],
  imports: [
    SharedModule,
    AmazingTimePickerModule,
    AppointmentSchedulerEventRoutingModule
  ]
})

export class AppointmentSchedulerEventModule { }