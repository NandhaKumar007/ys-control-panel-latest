import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogPageContentComponent } from './catalog-page-content.component';

const routes: Routes = [{ path: '', component: CatalogPageContentComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CatalogPageContentRoutingModule { }