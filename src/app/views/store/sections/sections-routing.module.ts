import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SectionsComponent } from './sections.component';

const routes: Routes = [
  { path: '', component: SectionsComponent },
  { path: ':section_id', loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule) },
  { path: ':section_id/:category_id', loadChildren: () => import('./categories/sub-categories/sub-categories.module').then(m => m.SubCategoriesModule) },
  { path: ':section_id/:category_id/:sub_category_id', loadChildren: () => import('./categories/sub-categories/child-sub-categories/child-sub-categories.module').then(m => m.ChildSubCategoriesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SectionsRoutingModule { }