import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonedCartDetailsComponent } from './abandoned-cart-details.component';

describe('AbandonedCartDetailsComponent', () => {
  let component: AbandonedCartDetailsComponent;
  let fixture: ComponentFixture<AbandonedCartDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbandonedCartDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbandonedCartDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
