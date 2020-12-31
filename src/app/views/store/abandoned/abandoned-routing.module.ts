import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedComponent } from './abandoned.component';

const routes: Routes = [
  { path: '', component: AbandonedComponent },
  { path: ':customer_id', loadChildren: () => import('./abandoned-details/abandoned-details.module').then(m => m.AbandonedDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedRoutingModule { }