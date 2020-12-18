import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { YsDashboardRoutingModule } from './ys-dashboard-routing.module';
import { YsDashboardComponent } from './ys-dashboard.component';

@NgModule({
  declarations: [YsDashboardComponent],
  imports: [
    SharedModule,
    YsDashboardRoutingModule
  ]
})

export class YsDashboardModule { }