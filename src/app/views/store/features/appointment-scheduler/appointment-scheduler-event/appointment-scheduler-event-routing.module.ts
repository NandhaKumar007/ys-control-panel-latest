import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentSchedulerEventComponent } from './appointment-scheduler-event.component';

const routes: Routes = [{ path: "", component: AppointmentSchedulerEventComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentSchedulerEventRoutingModule { }