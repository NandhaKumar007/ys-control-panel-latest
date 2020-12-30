import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { GeneralSettingRoutingModule } from './general-setting-routing.module';
import { GeneralSettingComponent } from './general-setting.component';

@NgModule({
  declarations: [GeneralSettingComponent],
  imports: [
    SharedModule,
    GeneralSettingRoutingModule
  ]
})

export class GeneralSettingModule { }