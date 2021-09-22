import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeployStagesComponent } from './deploy-stages.component';

describe('DeployStagesComponent', () => {
  let component: DeployStagesComponent;
  let fixture: ComponentFixture<DeployStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeployStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeployStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
