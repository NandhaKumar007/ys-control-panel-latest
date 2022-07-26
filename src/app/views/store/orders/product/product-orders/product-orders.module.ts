import { NgModule } from '@angular/core';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../../shared/shared.module';

import { ProductOrdersRoutingModule } from './product-orders-routing.module';
import { ProductOrdersComponent } from './product-orders.component';

@NgModule({
  declarations: [ProductOrdersComponent],
  imports: [
    SharedModule,
    AmazingTimePickerModule,
    ProductOrdersRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ProductOrdersModule { }