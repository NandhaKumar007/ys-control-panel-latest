import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';

const routes: Routes = [
  { path: '', component: ProductComponent },
  { path: 'add/:rank', loadChildren: () => import('./add-product/add-product.module').then(m => m.AddProductModule) },
  { path: 'modify/:product_id/:rank/:step', loadChildren: () => import('./modify-product/modify-product.module').then(m => m.ModifyProductModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductRoutingModule { }