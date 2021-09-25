import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebSigninComponent } from './web-signin.component';

describe('WebSigninComponent', () => {
  let component: WebSigninComponent;
  let fixture: ComponentFixture<WebSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
