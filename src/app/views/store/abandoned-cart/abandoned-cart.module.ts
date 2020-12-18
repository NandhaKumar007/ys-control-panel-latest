import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { AbandonedCartRoutingModule } from './abandoned-cart-routing.module';
import { AbandonedCartComponent } from './abandoned-cart.component';

@NgModule({
  declarations: [AbandonedCartComponent],
  imports: [
    SharedModule,
    AbandonedCartRoutingModule
  ]
})

export class AbandonedCartModule { }