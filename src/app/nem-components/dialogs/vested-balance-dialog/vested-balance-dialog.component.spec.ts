import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VestedBalanceDialogComponent } from './vested-balance-dialog.component';

describe('VestedBalanceDialogComponent', () => {
  let component: VestedBalanceDialogComponent;
  let fixture: ComponentFixture<VestedBalanceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VestedBalanceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VestedBalanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
