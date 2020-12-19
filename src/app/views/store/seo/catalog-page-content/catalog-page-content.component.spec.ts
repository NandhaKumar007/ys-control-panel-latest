import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPageContentComponent } from './catalog-page-content.component';

describe('CatalogPageContentComponent', () => {
  let component: CatalogPageContentComponent;
  let fixture: ComponentFixture<CatalogPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CatalogPageContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
