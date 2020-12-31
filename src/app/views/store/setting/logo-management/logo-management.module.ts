import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { LogoManagementRoutingModule } from './logo-management-routing.module';
import { LogoManagementComponent } from './logo-management.component';

@NgModule({
  declarations: [LogoManagementComponent],
  imports: [
    SharedModule,
    LogoManagementRoutingModule
  ]
})

export class LogoManagementModule { }