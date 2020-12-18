import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSubCategoriesComponent } from './child-sub-categories.component';

describe('ChildSubCategoriesComponent', () => {
  let component: ChildSubCategoriesComponent;
  let fixture: ComponentFixture<ChildSubCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildSubCategoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildSubCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
