import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YsInactivePaymentsComponent } from './ys-inactive-payments.component';

describe('YsInactivePaymentsComponent', () => {
  let component: YsInactivePaymentsComponent;
  let fixture: ComponentFixture<YsInactivePaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YsInactivePaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YsInactivePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
