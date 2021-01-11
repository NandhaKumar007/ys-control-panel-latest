import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'billing', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule), canActivate: [PermissionGuard], data: { name: "billing" } },
  { path: 'users', loadChildren: () => import('./sub-users/sub-users.module').then(m => m.SubUsersModule), canActivate: [PermissionGuard], data: { name: "sub_users" } },
  { path: 'vendors', loadChildren: () => import('./vendors/vendors.module').then(m => m.VendorsModule), canActivate: [PermissionGuard], data: { name: "vendors" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AccountRoutingModule { }