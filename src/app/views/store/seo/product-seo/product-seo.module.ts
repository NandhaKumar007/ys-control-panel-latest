import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductSeoRoutingModule } from './product-seo-routing.module';
import { ProductSeoComponent } from './product-seo.component';


@NgModule({
  declarations: [ProductSeoComponent],
  imports: [
    CommonModule,
    ProductSeoRoutingModule
  ]
})
export class ProductSeoModule { }
