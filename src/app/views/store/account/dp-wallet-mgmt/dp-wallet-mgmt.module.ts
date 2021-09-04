import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { DpWalletMgmtRoutingModule } from './dp-wallet-mgmt-routing.module';
import { DpWalletMgmtComponent } from './dp-wallet-mgmt.component';

@NgModule({
  declarations: [DpWalletMgmtComponent],
  imports: [
    SharedModule,
    DpWalletMgmtRoutingModule
  ]
})

export class DpWalletMgmtModule { }