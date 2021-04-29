import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickupLocationsComponent } from './pickup-locations.component';

describe('PickupLocationsComponent', () => {
  let component: PickupLocationsComponent;
  let fixture: ComponentFixture<PickupLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickupLocationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickupLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
