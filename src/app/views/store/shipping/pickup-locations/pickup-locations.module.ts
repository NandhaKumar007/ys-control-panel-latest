import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { PickupLocationsRoutingModule } from './pickup-locations-routing.module';
import { PickupLocationsComponent } from './pickup-locations.component';

@NgModule({
  declarations: [PickupLocationsComponent],
  imports: [
    SharedModule,
    PickupLocationsRoutingModule
  ]
})

export class PickupLocationsModule { }