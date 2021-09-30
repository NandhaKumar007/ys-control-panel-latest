import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { PaidAppsRoutingModule } from './paid-apps-routing.module';
import { PaidAppsComponent } from './paid-apps.component';

@NgModule({
  declarations: [PaidAppsComponent],
  imports: [
    SharedModule,
    PaidAppsRoutingModule
  ]
})

export class PaidAppsModule { }