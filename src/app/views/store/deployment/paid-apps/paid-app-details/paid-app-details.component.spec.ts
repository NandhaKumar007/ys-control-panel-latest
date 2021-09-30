import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidAppDetailsComponent } from './paid-app-details.component';

describe('PaidAppDetailsComponent', () => {
  let component: PaidAppDetailsComponent;
  let fixture: ComponentFixture<PaidAppDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidAppDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidAppDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
