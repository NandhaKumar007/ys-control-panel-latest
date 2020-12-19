import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CatalogPageContentRoutingModule } from './catalog-page-content-routing.module';
import { CatalogPageContentComponent } from './catalog-page-content.component';

@NgModule({
  declarations: [CatalogPageContentComponent],
  imports: [
    SharedModule,
    CatalogPageContentRoutingModule
  ]
})

export class CatalogPageContentModule { }