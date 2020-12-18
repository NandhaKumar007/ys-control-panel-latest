import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedCartComponent } from './abandoned-cart.component';

const routes: Routes = [
  { path: '', component: AbandonedCartComponent },
  { path: ':customer_id', loadChildren: () => import('./abandoned-cart-details/abandoned-cart-details.module').then(m => m.AbandonedCartDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedCartRoutingModule { }