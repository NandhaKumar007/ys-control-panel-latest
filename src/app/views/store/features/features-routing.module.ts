import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'blogs', loadChildren: () => import('./blog/blog.module').then(m => m.BlogModule) },
  { path: 'collections', loadChildren: () => import('./collections/collections.module').then(m => m.CollectionsModule) },
  { path: 'coupon-codes', loadChildren: () => import('./coupon-codes/coupon-codes.module').then(m => m.CouponCodesModule) },
  { path: 'discounts-page', loadChildren: () => import('./discounts-page/discounts-page.module').then(m => m.DiscountsPageModule) },
  { path: 'giftcard', loadChildren: () => import('./giftcard/giftcard.module').then(m => m.GiftcardModule) },
  { path: 'menus', loadChildren: () => import('./menus/menus.module').then(m => m.MenusModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FeaturesRoutingModule { }