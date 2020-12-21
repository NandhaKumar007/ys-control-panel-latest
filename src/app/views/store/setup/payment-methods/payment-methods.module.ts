import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodsComponent } from './payment-methods.component';


@NgModule({
  declarations: [PaymentMethodsComponent],
  imports: [
    CommonModule,
    PaymentMethodsRoutingModule
  ]
})
export class PaymentMethodsModule { }
