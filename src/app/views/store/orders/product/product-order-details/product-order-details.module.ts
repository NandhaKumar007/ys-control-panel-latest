import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ProductOrderDetailsRoutingModule } from './product-order-details-routing.module';
import { ProductOrderDetailsComponent } from './product-order-details.component';

@NgModule({
  declarations: [ProductOrderDetailsComponent],
  imports: [
    SharedModule,
    ProductOrderDetailsRoutingModule
  ]
})

export class ProductOrderDetailsModule { }