import { NgModule } from '@angular/core';
import { TagInputModule } from 'ngx-chips';
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { GeneralSettingRoutingModule } from './general-setting-routing.module';
import { GeneralSettingComponent } from './general-setting.component';

@NgModule({
  declarations: [GeneralSettingComponent],
  imports: [
    AmazingTimePickerModule,
    SharedModule,
    TagInputModule,
    GeneralSettingRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class GeneralSettingModule { }