import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../../shared/shared.module';

import { ModifyYsFeaturesRoutingModule } from './modify-ys-features-routing.module';
import { ModifyYsFeaturesComponent } from './modify-ys-features.component';

@NgModule({
  declarations: [ModifyYsFeaturesComponent],
  imports: [
    SharedModule,
    ModifyYsFeaturesRoutingModule,
    BsDatepickerModule.forRoot()
  ]
})

export class ModifyYsFeaturesModule { }