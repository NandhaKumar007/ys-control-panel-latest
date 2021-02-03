import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { GiftcardRoutingModule } from './giftcard-routing.module';
import { GiftcardComponent } from './giftcard.component';

@NgModule({
  declarations: [GiftcardComponent],
  imports: [
    SharedModule,
    GiftcardRoutingModule
  ]
})

export class GiftcardModule { }