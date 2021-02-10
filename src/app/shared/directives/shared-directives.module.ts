import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from './number-only.directive';
import { ScrollToDirective } from './scroll-to.directive';
import { UppercaseDirective } from './uppercase.directive';
import { NoSplCharDirective } from './no-spl-char.directive';

const directives = [
  NumberOnlyDirective,
  ScrollToDirective,
  UppercaseDirective,
  NoSplCharDirective
];

@NgModule({
  imports: [],
  declarations: directives,
  exports: directives
})

export class SharedDirectivesModule { }