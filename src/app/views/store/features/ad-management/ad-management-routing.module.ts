import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdManagementComponent } from './ad-management.component';

const routes: Routes = [
  { path: "", component: AdManagementComponent },
  { path: ':id', loadChildren: () => import('./ad-details/ad-details.module').then(m => m.AdDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdManagementRoutingModule { }