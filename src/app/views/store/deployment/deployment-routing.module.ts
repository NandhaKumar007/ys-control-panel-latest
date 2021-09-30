import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeploymentComponent } from './deployment.component';

const routes: Routes = [
  { path: '', component: DeploymentComponent },
  { path: 'logo', loadChildren: () => import('./deploy-logo/deploy-logo.module').then(m => m.DeployLogoModule) },
  { path: 'domain', loadChildren: () => import('./deploy-domain/deploy-domain.module').then(m => m.DeployDomainModule) },
  { path: 'plans', loadChildren: () => import('./deploy-packages/deploy-packages.module').then(m => m.DeployPackagesModule) },
  { path: 'apps', loadChildren: () => import('./paid-apps/paid-apps.module').then(m => m.PaidAppsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DeploymentRoutingModule { }