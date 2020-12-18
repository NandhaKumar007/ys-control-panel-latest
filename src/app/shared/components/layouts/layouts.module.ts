import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { StoreLayoutComponent } from './store-layout/store-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FormsModule } from '@angular/forms';

const components = [
  AuthLayoutComponent,
  AdminLayoutComponent,
  StoreLayoutComponent
];

@NgModule({
  imports: [
    NgbModule,
    RouterModule,
    FormsModule,
    PerfectScrollbarModule,
    CommonModule
  ],
  declarations: components,
  exports: components
})

export class LayoutsModule { }