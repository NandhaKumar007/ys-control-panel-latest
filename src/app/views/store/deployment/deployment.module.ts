import { NgModule } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { DeploymentRoutingModule } from './deployment-routing.module';
import { DeploymentComponent } from './deployment.component';

@NgModule({
  declarations: [DeploymentComponent],
  imports: [
    SharedModule,
    DeploymentRoutingModule
  ]
})

export class DeploymentModule { }