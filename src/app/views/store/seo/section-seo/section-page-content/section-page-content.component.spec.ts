import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPageContentComponent } from './section-page-content.component';

describe('SectionPageContentComponent', () => {
  let component: SectionPageContentComponent;
  let fixture: ComponentFixture<SectionPageContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionPageContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
