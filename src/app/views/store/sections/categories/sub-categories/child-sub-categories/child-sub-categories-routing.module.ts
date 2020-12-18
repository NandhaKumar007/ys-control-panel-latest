import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChildSubCategoriesComponent } from './child-sub-categories.component';

const routes: Routes = [{ path: '', component: ChildSubCategoriesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ChildSubCategoriesRoutingModule { }