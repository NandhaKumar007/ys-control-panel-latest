import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { SubCategoriesRoutingModule } from './sub-categories-routing.module';
import { SubCategoriesComponent } from './sub-categories.component';

@NgModule({
  declarations: [SubCategoriesComponent],
  imports: [
    SharedModule,
    SubCategoriesRoutingModule
  ]
})

export class SubCategoriesModule { }