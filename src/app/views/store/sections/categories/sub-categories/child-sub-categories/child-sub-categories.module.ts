import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../shared/shared.module';

import { ChildSubCategoriesRoutingModule } from './child-sub-categories-routing.module';
import { ChildSubCategoriesComponent } from './child-sub-categories.component';

@NgModule({
  declarations: [ChildSubCategoriesComponent],
  imports: [
    SharedModule,
    ChildSubCategoriesRoutingModule
  ]
})

export class ChildSubCategoriesModule { }