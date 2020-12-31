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
  { path: 'packages', loadChildren: () => import('./views/admin/ys-packages/ys-packages.module').then(m => m.YsPackagesModule) },
  { path: 'features', loadChildren: () => import('./views/admin/ys-features/ys-features.module').then(m => m.YsFeaturesModule) },
  { path: 'payments', loadChildren: () => import('./views/admin/ys-payments/ys-payments.module').then(m => m.YsPaymentsModule) },
  { path: 'subscribers', loadChildren: () => import('./views/admin/ys-subscribers/ys-subscribers.module').then(m => m.YsSubscribersModule) }
];

const storeRoutes: Routes = [
  { path: 'whats-new', loadChildren: () => import('./views/store/whats-new/whats-new.module').then(m => m.WhatsNewModule) },

  { path: 'dashboard', loadChildren: () => import('./views/store/dashboard/dashboard.module').then(m => m.DashboardModule) },
  { path: 'vendors-dashboard', loadChildren: () => import('./views/store/dashboard/vendors-dashboard/vendors-dashboard.module').then(m => m.VendorsDashboardModule) },

  { path: 'layouts', loadChildren: () => import('./views/store/layouts/layouts.module').then(m => m.LayoutsModule) },
  { path: 'catalogs', loadChildren: () => import('./views/store/catalogs/catalogs.module').then(m => m.CatalogsModule) },
  { path: 'products', loadChildren: () => import('./views/store/product/product.module').then(m => m.ProductModule) },
  { path: 'customers', loadChildren: () => import('./views/store/customers/customers.module').then(m => m.CustomersModule) },

  { path: 'abandoned-carts', loadChildren: () => import('./views/store/abandoned/abandoned.module').then(m => m.AbandonedModule) },
  { path: 'abandoned-quotes', loadChildren: () => import('./views/store/abandoned/abandoned.module').then(m => m.AbandonedModule) },
  { path: 'quotations/:type/:customer_id', loadChildren: () => import('./views/store/quotations/quotations.module').then(m => m.QuotationsModule) },
  { path: 'orders', loadChildren: () => import('./views/store/orders/orders.module').then(m => m.OrdersModule) },

  { path: 'features', loadChildren: () => import('./views/store/features/features.module').then(m => m.FeaturesModule) },
  { path: 'product-extras', loadChildren: () => import('./views/store/product-extras/product-extras.module').then(m => m.ProductExtrasModule) },
  { path: 'shipping', loadChildren: () => import('./views/store/shipping/shipping.module').then(m => m.ShippingModule) },
  { path: 'account', loadChildren: () => import('./views/store/account/account.module').then(m => m.AccountModule) },
  { path: 'setup', loadChildren: () => import('./views/store/setup/setup.module').then(m => m.SetupModule) },
  { path: 'seo', loadChildren: () => import('./views/store/seo/seo.module').then(m => m.SeoModule) },

  { path: 'feedback', loadChildren: () => import('./views/store/properties/feedback/feedback.module').then(m => m.FeedbackModule) },
  { path: 'newsletter', loadChildren: () => import('./views/store/properties/newsletter/newsletter.module').then(m => m.NewsletterModule) },
  { path: 'courier-partners', loadChildren: () => import('./views/store/courier-partners/courier-partners.module').then(m => m.CourierPartnersModule) },
  { path: 'donations', loadChildren: () => import('./views/store/donations/donations.module').then(m => m.DonationsModule) },

  { path: 'store-setting', loadChildren: () => import('./views/store/setting/general-setting/general-setting.module').then(m => m.GeneralSettingModule) },
  { path: 'logo-management', loadChildren: () => import('./views/store/setting/logo-management/logo-management.module').then(m => m.LogoManagementModule) }
];

const routes: Routes = [
  { path: '', redirectTo: 'session/signin', pathMatch: 'full' },
  { path: '404', loadChildren: () => import('./views/others/not-found/not-found.module').then(m => m.NotFoundModule) },
  { path: '', component: AuthLayoutComponent, children: sessionRoutes },
  { path: 'admin', component: AdminLayoutComponent, children: adminRoutes, canActivate: [MasterGuard] },
  { path: '', component: StoreLayoutComponent, children: storeRoutes, canActivate: [StoreGuard] },
  { path: '**', redirectTo: '404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})

export class AppRoutingModule { }