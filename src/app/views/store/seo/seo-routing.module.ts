import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'store', loadChildren: () => import('./store-seo/store-seo.module').then(m => m.StoreSeoModule) },
  { path: 'catalog', loadChildren: () => import('./catalog-seo/catalog-seo.module').then(m => m.CatalogSeoModule) },
  { path: 'catalog-page-content', loadChildren: () => import('./catalog-page-content/catalog-page-content.module').then(m => m.CatalogPageContentModule) },
  { path: 'product', loadChildren: () => import('./product-seo/product-seo.module').then(m => m.ProductSeoModule) },
  { path: 'blog', loadChildren: () => import('./blog-seo/blog-seo.module').then(m => m.BlogSeoModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SeoRoutingModule { }