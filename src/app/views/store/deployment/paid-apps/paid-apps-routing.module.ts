import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaidAppsComponent } from './paid-apps.component';

const routes: Routes = [{ path:"", component: PaidAppsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PaidAppsRoutingModule { }