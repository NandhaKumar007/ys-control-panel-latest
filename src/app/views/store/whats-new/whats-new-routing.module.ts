import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WhatsNewComponent } from './whats-new.component';

const routes: Routes = [{ path: '', component: WhatsNewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WhatsNewRoutingModule { }