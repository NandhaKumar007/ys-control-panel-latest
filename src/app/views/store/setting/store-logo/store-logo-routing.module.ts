import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StoreLogoComponent } from './store-logo.component';

const routes: Routes = [{ path: "", component: StoreLogoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class StoreLogoRoutingModule { }