import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagementRoutingModule } from './app-management-routing.module';
import { AppManagementComponent } from './app-management.component';


@NgModule({
  declarations: [AppManagementComponent],
  imports: [
    CommonModule,
    AppManagementRoutingModule
  ]
})
export class AppManagementModule { }
