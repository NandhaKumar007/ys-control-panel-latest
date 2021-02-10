import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'blogs', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule), canActivate: [PermissionGuard], data: { name: "blogs" } },
  { path: 'collections', loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule), canActivate: [PermissionGuard], data: { name: "collections" } },
  { path: 'coupon-codes', loadChildren: () => import('./coupon-codes/coupon-codes.module').then(m => m.CouponCodesModule), canActivate: [PermissionGuard], data: { name: "offers" } },
  { path: 'discounts-page', loadChildren: () => import('./discounts-page/discounts-page.module').then(m => m.DiscountsPageModule), canActivate: [PermissionGuard], data: { name: "discounts_page" } },
  { path: 'giftcard', loadChildren: () => import('./giftcard/giftcard.module').then(m => m.GiftcardModule), canActivate: [PermissionGuard], data: { name: "giftcard" } },
  { path: 'menus', loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule), canActivate: [PermissionGuard], data: { name: "menus" } },
  { path: 'dinamic-offers', loadChildren: () => import('./dinamic-offers/dinamic-offers.module').then(m => m.DinamicOffersModule), canActivate: [PermissionGuard], data: { name: "dinamic_offers" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }