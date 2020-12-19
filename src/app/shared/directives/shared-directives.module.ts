import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from './number-only.directive';
import { ScrollToDirective } from './scroll-to.directive';
import { UppercaseDirective } from './uppercase.directive';

const directives = [
  NumberOnlyDirective,
  ScrollToDirective,
  UppercaseDirective
];

@NgModule({
  imports: [],
  declarations: directives,
  exports: directives
})

export class SharedDirectivesModule { }