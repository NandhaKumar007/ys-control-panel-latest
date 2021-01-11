import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PermissionGuard } from '../../../guards/permission.guard';

const routes: Routes = [
  { path: 'store', loadChildren: () => import('./store-seo/store-seo.module').then(m => m.StoreSeoModule), canActivate: [PermissionGuard], data: { name: "store_seo" } },
  { path: 'catalog', loadChildren: () => import('./catalog-seo/catalog-seo.module').then(m => m.CatalogSeoModule), canActivate: [PermissionGuard], data: { name: "catalog_seo" } },
  { path: 'catalog-page-content', loadChildren: () => import('./catalog-page-content/catalog-page-content.module').then(m => m.CatalogPageContentModule), canActivate: [PermissionGuard], data: { name: "catalog_page_content" } },
  { path: 'product', loadChildren: () => import('./product-seo/product-seo.module').then(m => m.ProductSeoModule), canActivate: [PermissionGuard], data: { name: "product_seo" } },
  { path: 'blog', loadChildren: () => import('./blog-seo/blog-seo.module').then(m => m.BlogSeoModule), canActivate: [PermissionGuard], data: { name: "blog_seo" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SeoRoutingModule { }