import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangellyComponent } from './changelly.component';

describe('ChangellyComponent', () => {
  let component: ChangellyComponent;
  let fixture: ComponentFixture<ChangellyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangellyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangellyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
