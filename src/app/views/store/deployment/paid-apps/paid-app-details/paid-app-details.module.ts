import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { PaidAppDetailsRoutingModule } from './paid-app-details-routing.module';
import { PaidAppDetailsComponent } from './paid-app-details.component';

@NgModule({
  declarations: [PaidAppDetailsComponent],
  imports: [
    SharedModule,
    PaidAppDetailsRoutingModule
  ]
})

export class PaidAppDetailsModule { }