import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogSeoRoutingModule } from './catalog-seo-routing.module';
import { CatalogSeoComponent } from './catalog-seo.component';

@NgModule({
  declarations: [CatalogSeoComponent],
  imports: [
    SharedModule,
    CatalogSeoRoutingModule
  ]
})

export class CatalogSeoModule { }