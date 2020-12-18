import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { AbandonedCartDetailsRoutingModule } from './abandoned-cart-details-routing.module';
import { AbandonedCartDetailsComponent } from './abandoned-cart-details.component';

@NgModule({
  declarations: [AbandonedCartDetailsComponent],
  imports: [
    SharedModule,
    AbandonedCartDetailsRoutingModule
  ]
})

export class AbandonedCartDetailsModule { }