import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionSeoRoutingModule } from './section-seo-routing.module';
import { SectionSeoComponent } from './section-seo.component';


@NgModule({
  declarations: [SectionSeoComponent],
  imports: [
    CommonModule,
    SectionSeoRoutingModule
  ]
})
export class SectionSeoModule { }
