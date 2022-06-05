import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ProductTagsRoutingModule } from './product-tags-routing.module';
import { ProductTagsComponent } from './product-tags.component';

@NgModule({
  declarations: [ProductTagsComponent],
  imports: [
    SharedModule,
    ProductTagsRoutingModule
  ]
})

export class ProductTagsModule { }