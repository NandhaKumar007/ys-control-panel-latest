import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { StoreLogoRoutingModule } from './store-logo-routing.module';
import { StoreLogoComponent } from './store-logo.component';

@NgModule({
  declarations: [StoreLogoComponent],
  imports: [
    SharedModule,
    StoreLogoRoutingModule
  ]
})

export class StoreLogoModule { }