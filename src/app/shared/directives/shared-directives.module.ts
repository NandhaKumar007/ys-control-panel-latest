import { NgModule } from '@angular/core';
import { NumberOnlyDirective } from './number-only.directive';
import { ScrollToDirective } from './scroll-to.directive';
import { UppercaseDirective } from './uppercase.directive';
import { NoSplCharDirective } from './no-spl-char.directive';
import { ImgBrokenDirective } from './img-broken.directive';

const directives = [
  NumberOnlyDirective,
  ScrollToDirective,
  UppercaseDirective,
  NoSplCharDirective,
  ImgBrokenDirective
];

@NgModule({
  imports: [],
  declarations: directives,
  exports: directives
})

export class SharedDirectivesModule { }