import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule,
    NgxEchartsModule,
    DashboardRoutingModule,
    BsDatepickerModule.forRoot(),    
    NgxDaterangepickerMd.forRoot()
    
  ],
  providers: [DatePipe]
})

export class DashboardModule { }