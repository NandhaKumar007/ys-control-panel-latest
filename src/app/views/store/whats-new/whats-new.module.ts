import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { WhatsNewRoutingModule } from './whats-new-routing.module';
import { WhatsNewComponent } from './whats-new.component';


@NgModule({
  declarations: [WhatsNewComponent],
  imports: [
    SharedModule,
    WhatsNewRoutingModule
  ]
})

export class WhatsNewModule { }