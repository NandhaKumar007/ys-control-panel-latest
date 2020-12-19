import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductSeoRoutingModule } from './product-seo-routing.module';
import { ProductSeoComponent } from './product-seo.component';

@NgModule({
  declarations: [ProductSeoComponent],
  imports: [
    SharedModule,
    ProductSeoRoutingModule
  ]
})

export class ProductSeoModule { }