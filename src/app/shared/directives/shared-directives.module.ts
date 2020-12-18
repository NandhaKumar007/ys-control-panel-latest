import { NgModule } from '@angular/core';
import { DropdownAnchorDirective } from './dropdown-anchor.directive';
import { DropdownLinkDirective } from './dropdown-link.directive';
import { AppDropdownDirective } from './dropdown.directive';
import { FullScreenWindowDirective } from './full-screen.directive';
import { NumberOnlyDirective } from './number-only.directive';
import { ScrollToDirective } from './scroll-to.directive';
import { SidebarDirective, SidebarContainerDirective, SidebarContentDirective, SidebarTogglerDirective } from './sidebar.directive';
import { UppercaseDirective } from './uppercase.directive';

const directives = [
  DropdownAnchorDirective,
  DropdownLinkDirective,
  AppDropdownDirective,
  FullScreenWindowDirective,
  NumberOnlyDirective,
  ScrollToDirective,
  SidebarDirective,
  SidebarContainerDirective,
  SidebarContentDirective,
  SidebarTogglerDirective,
  UppercaseDirective
];

@NgModule({
  imports: [],
  declarations: directives,
  exports: directives
})

export class SharedDirectivesModule { }