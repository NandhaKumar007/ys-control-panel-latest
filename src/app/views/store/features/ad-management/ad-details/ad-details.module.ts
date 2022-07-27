import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { AdDetailsRoutingModule } from './ad-details-routing.module';
import { AdDetailsComponent } from './ad-details.component';

@NgModule({
  declarations: [AdDetailsComponent],
  imports: [
    SharedModule,
    AdDetailsRoutingModule
  ]
})

export class AdDetailsModule { }