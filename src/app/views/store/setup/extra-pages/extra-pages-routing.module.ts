import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtraPagesComponent } from './extra-pages.component';

const routes: Routes = [{ path: "", component: ExtraPagesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ExtraPagesRoutingModule { }