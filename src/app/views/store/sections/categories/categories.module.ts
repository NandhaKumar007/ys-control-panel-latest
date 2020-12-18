import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesComponent } from './categories.component';

@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    SharedModule,
    CategoriesRoutingModule
  ]
})

export class CategoriesModule { }