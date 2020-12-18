import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: 'addons', loadChildren: () => import('./addons/addons.module').then(m => m.AddonsModule) },
  { path: 'archive', loadChildren: () => import('./archive/archive.module').then(m => m.ArchiveModule) },
  { path: 'faq', loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule) },
  { path: 'foot-note', loadChildren: () => import('./foot-note/foot-note.module').then(m => m.FootNoteModule) },
  { path: 'measurement-sets', loadChildren: () => import('./measurements/measurements.module').then(m => m.MeasurementsModule) },
  { path: 'shop-assistant', loadChildren: () => import('./shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule) },
  { path: 'shop-assistant/:type', loadChildren: () => import('./shop-assistant/shop-assistant.module').then(m => m.ShopAssistantModule) },
  { path: 'sizing-assistant', loadChildren: () => import('./sizing-assistant/sizing-assistant.module').then(m => m.SizingAssistantModule) },
  { path: 'size-chart', loadChildren: () => import('./size-chart/size-chart.module').then(m => m.SizeChartModule) },
  { path: 'tags', loadChildren: () => import('./tag/tag.module').then(m => m.TagModule) },
  { path: 'tax-rates', loadChildren: () => import('./tax-rates/tax-rates.module').then(m => m.TaxRatesModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProductExtrasRoutingModule { }