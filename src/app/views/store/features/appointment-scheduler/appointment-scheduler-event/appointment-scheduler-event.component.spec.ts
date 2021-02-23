import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSchedulerEventComponent } from './appointment-scheduler-event.component';

describe('AppointmentSchedulerEventComponent', () => {
  let component: AppointmentSchedulerEventComponent;
  let fixture: ComponentFixture<AppointmentSchedulerEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentSchedulerEventComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentSchedulerEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
