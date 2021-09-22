import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DeployStagesRoutingModule } from './deploy-stages-routing.module';
import { DeployStagesComponent } from './deploy-stages.component';

@NgModule({
  declarations: [DeployStagesComponent],
  imports: [
    SharedModule,
    DeployStagesRoutingModule
  ]
})

export class DeployStagesModule { }