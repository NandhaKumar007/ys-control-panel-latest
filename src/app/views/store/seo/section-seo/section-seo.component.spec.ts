import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionSeoComponent } from './section-seo.component';

describe('SectionSeoComponent', () => {
  let component: SectionSeoComponent;
  let fixture: ComponentFixture<SectionSeoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionSeoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionSeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
