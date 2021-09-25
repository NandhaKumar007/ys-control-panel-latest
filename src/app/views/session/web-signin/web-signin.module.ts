import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebSigninRoutingModule } from './web-signin-routing.module';
import { WebSigninComponent } from './web-signin.component';

@NgModule({
  declarations: [WebSigninComponent],
  imports: [
    CommonModule,
    WebSigninRoutingModule
  ]
})

export class WebSigninModule { }