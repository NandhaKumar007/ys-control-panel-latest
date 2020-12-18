import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogSeoRoutingModule } from './blog-seo-routing.module';
import { BlogSeoComponent } from './blog-seo.component';


@NgModule({
  declarations: [BlogSeoComponent],
  imports: [
    CommonModule,
    BlogSeoRoutingModule
  ]
})
export class BlogSeoModule { }
