import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { ImageCropperModule } from 'ngx-img-cropper';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { ModifyProductRoutingModule } from './modify-product-routing.module';
import { ModifyProductComponent } from './modify-product.component';

@NgModule({
  declarations: [ModifyProductComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    TagInputModule,
    ImageCropperModule,
    SharedModule,
    ModifyProductRoutingModule
  ]
})

export class ModifyProductModule { }