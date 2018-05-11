import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedRestartComponent } from './automated-restart.component';

describe('AutomatedRestartComponent', () => {
  let component: AutomatedRestartComponent;
  let fixture: ComponentFixture<AutomatedRestartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomatedRestartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedRestartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
