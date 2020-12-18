import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { OrdersRoutingModule } from './orders-routing.module';

@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    OrdersRoutingModule
  ]
})

export class OrdersModule { }