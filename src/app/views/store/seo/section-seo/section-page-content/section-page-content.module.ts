import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionPageContentRoutingModule } from './section-page-content-routing.module';
import { SectionPageContentComponent } from './section-page-content.component';


@NgModule({
  declarations: [SectionPageContentComponent],
  imports: [
    CommonModule,
    SectionPageContentRoutingModule
  ]
})
export class SectionPageContentModule { }
