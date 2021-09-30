import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaidAppDetailsComponent } from './paid-app-details.component';

const routes: Routes = [{ path: "", component: PaidAppDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaidAppDetailsRoutingModule { }