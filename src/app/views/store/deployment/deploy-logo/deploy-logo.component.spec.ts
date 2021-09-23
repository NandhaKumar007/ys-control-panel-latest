import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployLogoComponent } from './deploy-logo.component';

describe('DeployLogoComponent', () => {
  let component: DeployLogoComponent;
  let fixture: ComponentFixture<DeployLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
