import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { HomeLayoutRoutingModule } from './home-layout-routing.module';
import { HomeLayoutComponent } from './home-layout.component';

@NgModule({
  declarations: [HomeLayoutComponent],
  imports: [
    SharedModule,
    HomeLayoutRoutingModule
  ]
})

export class HomeLayoutModule { }