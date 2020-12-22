import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreSeoRoutingModule } from './store-seo-routing.module';
import { StoreSeoComponent } from './store-seo.component';

@NgModule({
  declarations: [StoreSeoComponent],
  imports: [
    SharedModule,
    TagInputModule,
    StoreSeoRoutingModule
  ]
})

export class StoreSeoModule { }