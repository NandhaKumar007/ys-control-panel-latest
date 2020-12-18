import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';

@NgModule({
  declarations: [BlogComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    BlogRoutingModule
  ]
})

export class BlogModule { }