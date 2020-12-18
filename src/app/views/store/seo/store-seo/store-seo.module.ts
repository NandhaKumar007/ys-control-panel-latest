import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreSeoRoutingModule } from './store-seo-routing.module';
import { StoreSeoComponent } from './store-seo.component';


@NgModule({
  declarations: [StoreSeoComponent],
  imports: [
    CommonModule,
    StoreSeoRoutingModule
  ]
})
export class StoreSeoModule { }
