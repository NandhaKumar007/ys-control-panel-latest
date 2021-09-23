import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployLogoComponent } from './deploy-logo.component';

const routes: Routes = [{ path: "", component: DeployLogoComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeployLogoRoutingModule { }