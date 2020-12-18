import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LayoutsModule } from './layouts/layouts.module';

const components = [
  BtnLoadingComponent,
  SpinnerComponent
];

@NgModule({
  imports: [
    CommonModule,
    LayoutsModule
  ],
  declarations: components,
  exports: components
})

export class SharedComponentsModule { }