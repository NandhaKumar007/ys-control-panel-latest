import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployStagesComponent } from './deploy-stages.component';

const routes: Routes = [{ path: "", component: DeployStagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeployStagesRoutingModule { }