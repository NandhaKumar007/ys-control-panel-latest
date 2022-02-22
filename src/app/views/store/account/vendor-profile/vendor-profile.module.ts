import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorProfileRoutingModule } from './vendor-profile-routing.module';
import { VendorProfileComponent } from './vendor-profile.component';

@NgModule({
  declarations: [VendorProfileComponent],
  imports: [
    CommonModule,
    VendorProfileRoutingModule
  ]
})

export class VendorProfileModule { }