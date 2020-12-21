import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSettingComponent } from './checkout-setting.component';

describe('CheckoutSettingComponent', () => {
  let component: CheckoutSettingComponent;
  let fixture: ComponentFixture<CheckoutSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckoutSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
