import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShippingPolicyRoutingModule } from './shipping-policy-routing.module';
import { ShippingPolicyComponent } from './shipping-policy.component';


@NgModule({
  declarations: [ShippingPolicyComponent],
  imports: [
    CommonModule,
    ShippingPolicyRoutingModule
  ]
})
export class ShippingPolicyModule { }
