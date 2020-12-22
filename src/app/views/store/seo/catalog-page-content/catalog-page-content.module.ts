import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { CatalogPageContentRoutingModule } from './catalog-page-content-routing.module';
import { CatalogPageContentComponent } from './catalog-page-content.component';

@NgModule({
  declarations: [CatalogPageContentComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    CatalogPageContentRoutingModule
  ]
})

export class CatalogPageContentModule { }