import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LogoManagementRoutingModule } from './logo-management-routing.module';
import { LogoManagementComponent } from './logo-management.component';


@NgModule({
  declarations: [LogoManagementComponent],
  imports: [
    CommonModule,
    LogoManagementRoutingModule
  ]
})
export class LogoManagementModule { }
