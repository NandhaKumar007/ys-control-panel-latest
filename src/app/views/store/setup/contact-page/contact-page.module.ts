import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { ContactPageRoutingModule } from './contact-page-routing.module';
import { ContactPageComponent } from './contact-page.component';

@NgModule({
  declarations: [ContactPageComponent],
  imports: [
    SharedModule,
    ContactPageRoutingModule
  ]
})

export class ContactPageModule { }