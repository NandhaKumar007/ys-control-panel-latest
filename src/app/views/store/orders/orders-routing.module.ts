import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'create-order', loadChildren: () => import('./product/create-product-order/create-product-order.module').then(m => m.CreateProductOrderModule), canActivate: [PermissionGuard], data: { name: "manual_order" } },
  { path: 'product/:type/:customer_id', loadChildren: () => import('./product/product-orders/product-orders.module').then(m => m.ProductOrdersModule), canActivate: [PermissionGuard], data: { name: "orders" } },
  { path: 'inactive-orders', loadChildren: () => import('./product/inactive-product-orders/inactive-product-orders.module').then(m => m.InactiveProductOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_orders" } },
  { path: 'product/:type/:customer_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "orders" } },

  { path: 'gift-coupon', loadChildren: () => import('./giftcard/giftcard-orders/giftcard-orders.module').then(m => m.GiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },
  { path: 'inactive-gift-coupons', loadChildren: () => import('./giftcard/inactive-giftcard-orders/inactive-giftcard-orders.module').then(m => m.InactiveGiftcardOrdersModule), canActivate: [PermissionGuard], data: { name: "inactive_orders" } },
  { path: 'gift-coupon/:coupon_id', loadChildren: () => import('./giftcard/giftcard-order-details/giftcard-order-details.module').then(m => m.GiftcardOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } },
  { path: 'gift-coupon/:coupon_id/:order_id', loadChildren: () => import('./product/product-order-details/product-order-details.module').then(m => m.ProductOrderDetailsModule), canActivate: [PermissionGuard], data: { name: "giftcard_orders" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OrdersRoutingModule { }