import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PickupLocationsComponent } from './pickup-locations.component';

const routes: Routes = [{ path: "", component: PickupLocationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PickupLocationsRoutingModule { }