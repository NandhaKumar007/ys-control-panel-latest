import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { AddProductRoutingModule } from './add-product-routing.module';
import { AddProductComponent } from './add-product.component';

@NgModule({
  declarations: [AddProductComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    ImageCropperModule,
    SharedModule,
    AddProductRoutingModule
  ]
})

export class AddProductModule { }