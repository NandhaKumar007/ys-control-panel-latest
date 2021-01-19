import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { YsInactivePaymentsComponent } from './ys-inactive-payments.component';

const routes: Routes = [{ path: '', component: YsInactivePaymentsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class YsInactivePaymentsRoutingModule { }