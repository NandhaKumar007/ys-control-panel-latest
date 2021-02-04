import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StoreGuard } from './guards/store.guard';
import { MasterGuard } from './guards/master.guard';
import { PermissionGuard } from './guards/permission.guard';

import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './shared/components/layouts/admin-layout/admin-layout.component';
import { StoreLayoutComponent } from './shared/components/layouts/store-layout/store-layout.component';

const sessionRoutes: Routes = [
  { path: 'session', loadChildren: () => import('./views/session/session.module').then(m => m.SessionModule) },
  { path: 'control-panel', loadChildren: () => import('./views/admin/control-panel/control-panel.module').then(m => m.ControlPanelModule), canActivate: [MasterGuard] }
];

const adminRoutes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./views/admin/ys-dashboard/ys-dashboard.module').then(m => m.YsDashboardModule) },
  { path: 'currencies', loadChildren: () => import('./views/admin/ys-currencies/ys-currencies.module').then(m => m.YsCurrenciesModule) },
  { path: 'clients', loadChildren: () => import('./views/admin/ys-clients/ys-clients.module').then(m => m.YsClientsModule) },
  { path: 'dealers', loadChildren: () => import('./views/admin/ys-dealers/ys-dealers.module').then(m => m.YsDealersModule) },
  { path: 'packages', loadChildren: () => import('./views/admin/ys-packages/ys-packages.module').then(m => m.YsPackagesModule) },
  { path: 'features', loadChildren: () => import('./views/admin/ys-features/ys-features.module').then(m => m.YsFeaturesModule) },
  { path: 'payments', loadChildren: () => import('./views/admin/ys-payments/ys-payments.module').then(m => m.YsPaymentsModule) },
  { path: 'inactive-payments', loadChildren: () => import('./views/admin/ys-inactive-payments/ys-inactive-payments.module').then(m => m.YsInactivePaymentsModule) },
  { path: 'subscribers', loadChildren: () => import('./views/admin/ys-subscribers/ys-subscribers.module').then(m => m.YsSubscribersModule) }
];

const storeRoutes: Routes = [
  { path: 'whats-new', loadChildren: () => import('./views/store/whats-new/whats-new.module').then(m => m.WhatsNewModule), canActivate: [StoreGuard] },

  { path: 'dashboard', loadChildren: () => import('./views/store/dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [PermissionGuard], data: { name: "dashboard" } },
  { path: 'vendors-dashboard', loadChildren: () => import('./views/store/dashboard/vendors-dashboard/vendors-dashboard.module').then(m => m.VendorsDashboardModule), canActivate: [PermissionGuard], data: { name: "vendor_dashboard" } },

  { path: 'layouts', loadChildren: () => import('./views/store/layouts/layouts.module').then(m => m.LayoutsModule) },
  { path: 'catalogs', loadChildren: () => import('./views/store/catalogs/catalogs.module').then(m => m.CatalogsModule), canActivate: [PermissionGuard], data: { name: "catalogs" } },
  { path: 'products', loadChildren: () => import('./views/store/product/product.module').then(m => m.ProductModule) },
  { path: 'customers', loadChildren: () => import('./views/store/customers/customers.module').then(m => m.CustomersModule), canActivate: [PermissionGuard], data: { name: "customers" } },

  { path: 'abandoned-carts', loadChildren: () => import('./views/store/abandoned/abandoned.module').then(m => m.AbandonedModule), canActivate: [PermissionGuard], data: { name: "abandoned_cart" } },
  { path: 'abandoned-quotes', loadChildren: () => import('./views/store/abandoned/abandoned.module').then(m => m.AbandonedModule), canActivate: [PermissionGuard], data: { name: "abandoned_quotes" } },
  { path: 'quotations/:type/:customer_id', loadChildren: () => import('./views/store/quotations/quotations.module').then(m => m.QuotationsModule), canActivate: [PermissionGuard], data: { name: "quotations" } },
  { path: 'orders', loadChildren: () => import('./views/store/orders/orders.module').then(m => m.OrdersModule) },

  { path: 'features', loadChildren: () => import('./views/store/features/features.module').then(m => m.FeaturesModule) },
  { path: 'product-extras', loadChildren: () => import('./views/store/product-extras/product-extras.module').then(m => m.ProductExtrasModule) },
  { path: 'shipping', loadChildren: () => import('./views/store/shipping/shipping.module').then(m => m.ShippingModule) },
  { path: 'account', loadChildren: () => import('./views/store/account/account.module').then(m => m.AccountModule) },
  { path: 'setup', loadChildren: () => import('./views/store/setup/setup.module').then(m => m.SetupModule) },
  { path: 'seo', loadChildren: () => import('./views/store/seo/seo.module').then(m => m.SeoModule) },

  { path: 'feedback', loadChildren: () => import('./views/store/properties/feedback/feedback.module').then(m => m.FeedbackModule), canActivate: [PermissionGuard], data: { name: "feedback" } },
  { path: 'newsletter', loadChildren: () => import('./views/store/properties/newsletter/newsletter.module').then(m => m.NewsletterModule), canActivate: [PermissionGuard], data: { name: "newsletter" } },
  { path: 'courier-partners', loadChildren: () => import('./views/store/courier-partners/courier-partners.module').then(m => m.CourierPartnersModule), canActivate: [PermissionGuard], data: { name: "courier_partners" } },
  { path: 'donations', loadChildren: () => import('./views/store/donations/donations.module').then(m => m.DonationsModule), canActivate: [PermissionGuard], data: { name: "donations" } },

  { path: 'store-setting', loadChildren: () => import('./views/store/setting/setting.module').then(m => m.SettingModule), canActivate: [PermissionGuard], data: { name: "store_setting" } },
  { path: 'store-logos', loadChildren: () => import('./views/store/setting/logo-management/logo-management.module').then(m => m.LogoManagementModule), canActivate: [PermissionGuard], data: { name: "store_setting" } }
];

const routes: Routes = [
  { path: '', redirectTo: 'session/signin', pathMatch: 'full' },
  { path: '404', loadChildren: () => import('./views/others/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: '', component: AuthLayoutComponent, children: sessionRoutes },
  { path: 'admin', component: AdminLayoutComponent, children: adminRoutes, canActivate: [MasterGuard] },
  { path: '', component: StoreLayoutComponent, children: storeRoutes },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }