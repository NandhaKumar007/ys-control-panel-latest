import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancellationPolicyRoutingModule } from './cancellation-policy-routing.module';
import { CancellationPolicyComponent } from './cancellation-policy.component';


@NgModule({
  declarations: [CancellationPolicyComponent],
  imports: [
    CommonModule,
    CancellationPolicyRoutingModule
  ]
})
export class CancellationPolicyModule { }
