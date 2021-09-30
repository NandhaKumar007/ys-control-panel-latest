import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaidAppsComponent } from './paid-apps.component';

describe('PaidAppsComponent', () => {
  let component: PaidAppsComponent;
  let fixture: ComponentFixture<PaidAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaidAppsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
