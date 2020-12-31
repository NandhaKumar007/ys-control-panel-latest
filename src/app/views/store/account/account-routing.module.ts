import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'billing', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) },
  { path: 'users', loadChildren: () => import('./sub-users/sub-users.module').then(m => m.SubUsersModule) },
  { path: 'vendors', loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule { }