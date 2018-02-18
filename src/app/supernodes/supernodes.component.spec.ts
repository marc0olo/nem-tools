import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupernodesComponent } from './supernodes.component';

describe('SupernodesComponent', () => {
  let component: SupernodesComponent;
  let fixture: ComponentFixture<SupernodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupernodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupernodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
