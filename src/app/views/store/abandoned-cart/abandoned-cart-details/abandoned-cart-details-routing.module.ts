import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AbandonedCartDetailsComponent } from './abandoned-cart-details.component';

const routes: Routes = [{ path: '', component: AbandonedCartDetailsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AbandonedCartDetailsRoutingModule { }