import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';

import { ReviewDetailsRoutingModule } from './review-details-routing.module';
import { ReviewDetailsComponent } from './review-details.component';

@NgModule({
  declarations: [ReviewDetailsComponent],
  imports: [
    SharedModule,
    ReviewDetailsRoutingModule
  ]
})

export class ReviewDetailsModule { }