import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'shipping-methods', loadChildren: () => import('./shipping-methods/shipping-methods.module').then(m => m.ShippingMethodsModule) },
  { path: 'delivery-methods', loadChildren: () => import('./delivery-methods/delivery-methods.module').then(m => m.DeliveryMethodsModule) },
  { path: 'pincodes', loadChildren: () => import('./pincodes/pincodes.module').then(m => m.PincodesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ShippingRoutingModule { }