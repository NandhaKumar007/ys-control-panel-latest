import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home-layout/home-layout.module').then(m => m.HomeLayoutModule) },
  { path: 'catalog', loadChildren: () => import('./catalog-layout/catalog-layout.module').then(m => m.CatalogLayoutModule) },
  { path: 'product', loadChildren: () => import('./product-layout/product-layout.module').then(m => m.ProductLayoutModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class LayoutsRoutingModule { }