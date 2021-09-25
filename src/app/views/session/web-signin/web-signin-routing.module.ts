import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebSigninComponent } from './web-signin.component';

const routes: Routes = [{ path: "", component: WebSigninComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WebSigninRoutingModule { }