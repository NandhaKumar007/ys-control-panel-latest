import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreSeoRoutingModule } from './store-seo-routing.module';
import { StoreSeoComponent } from './store-seo.component';

@NgModule({
  declarations: [StoreSeoComponent],
  imports: [
    SharedModule,
    StoreSeoRoutingModule
  ]
})

export class StoreSeoModule { }