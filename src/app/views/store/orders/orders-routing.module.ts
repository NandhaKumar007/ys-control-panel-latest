import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'create-order', loadChildren: () => import('./product/create-product-order/create-product-order.module').then(m => m.CreateProductOrderModule) },
  { path: 'product/:type/:customer_id', loadChildren: () => import('./product/product-orders/product-orders.module').then(m => m.ProductOrdersModule) },
  { path: 'inactive-orders', loadChildren: () => import('./product/inactive-product-orders/inactive-product-orders.module').then(m => m.InactiveProductOrdersModule) },
  { path: 'product/:type/:customer_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule) },

  { path: 'gift-coupon', loadChildren: () => import('./giftcard/giftcard-orders/giftcard-orders.module').then(m => m.GiftcardOrdersModule) },
  { path: 'inactive-gift-coupons', loadChildren: () => import('./giftcard/inactive-giftcard-orders/inactive-giftcard-orders.module').then(m => m.InactiveGiftcardOrdersModule) },
  { path: 'gift-coupon/:coupon_id', loadChildren: () => import('./giftcard/giftcard-order-details/giftcard-order-details.module').then(m => m.GiftcardOrderDetailsModule) },
  { path: 'gift-coupon/:coupon_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrdersRoutingModule { }