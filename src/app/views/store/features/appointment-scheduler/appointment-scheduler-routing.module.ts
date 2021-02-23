import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentSchedulerComponent } from './appointment-scheduler.component';

const routes: Routes = [
  { path: "", component: AppointmentSchedulerComponent },
  { path: 'add/:rank', loadChildren: () => import('./appointment-scheduler-event/appointment-scheduler-event.module').then(m => m.AppointmentSchedulerEventModule) },
  { path: 'modify/:id/:rank', loadChildren: () => import('./appointment-scheduler-event/appointment-scheduler-event.module').then(m => m.AppointmentSchedulerEventModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AppointmentSchedulerRoutingModule { }