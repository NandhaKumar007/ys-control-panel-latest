import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutSettingRoutingModule } from './checkout-setting-routing.module';
import { CheckoutSettingComponent } from './checkout-setting.component';


@NgModule({
  declarations: [CheckoutSettingComponent],
  imports: [
    CommonModule,
    CheckoutSettingRoutingModule
  ]
})
export class CheckoutSettingModule { }
