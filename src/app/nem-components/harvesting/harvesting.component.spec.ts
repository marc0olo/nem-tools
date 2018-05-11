import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarvestingComponent } from './harvesting.component';

describe('HarvestingComponent', () => {
  let component: HarvestingComponent;
  let fixture: ComponentFixture<HarvestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarvestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarvestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
