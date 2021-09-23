import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';
import { SharedModule } from '../../../../shared/shared.module';

import { DeployLogoRoutingModule } from './deploy-logo-routing.module';
import { DeployLogoComponent } from './deploy-logo.component';

@NgModule({
  declarations: [DeployLogoComponent],
  imports: [
    SharedModule,
    ColorPickerModule,
    DeployLogoRoutingModule
  ]
})

export class DeployLogoModule { }