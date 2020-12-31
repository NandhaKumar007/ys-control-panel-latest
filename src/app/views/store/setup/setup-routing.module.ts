import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'currency-types', loadChildren: () => import('./currency-types/currency-types.module').then(m => m.CurrencyTypesModule) },
  { path: 'payment-gateway', loadChildren: () => import('./payment-methods/payment-methods.module').then(m => m.PaymentMethodsModule) },
  { path: 'contact-page', loadChildren: () => import('./contact-page/contact-page.module').then(m => m.ContactPageModule) },
  { path: 'store-locator', loadChildren: () => import('./store-locator/store-locator.module').then(m => m.StoreLocatorModule) },
  { path: 'policies/:type', loadChildren: () => import('./policies/policies.module').then(m => m.PoliciesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupRoutingModule { }
