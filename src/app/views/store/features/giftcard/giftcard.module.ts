import { NgModule } from '@angular/core';
import { QuillModule } from 'ngx-quill';
import { SharedModule } from '../../../../shared/shared.module';
import { environment } from '../../../../../environments/environment';

import { GiftcardRoutingModule } from './giftcard-routing.module';
import { GiftcardComponent } from './giftcard.component';

@NgModule({
  declarations: [GiftcardComponent],
  imports: [
    QuillModule.forRoot(environment.quill_config),
    SharedModule,
    GiftcardRoutingModule
  ]
})

export class GiftcardModule { }