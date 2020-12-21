import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MailConfigRoutingModule } from './mail-config-routing.module';
import { MailConfigComponent } from './mail-config.component';


@NgModule({
  declarations: [MailConfigComponent],
  imports: [
    CommonModule,
    MailConfigRoutingModule
  ]
})
export class MailConfigModule { }
