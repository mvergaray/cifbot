import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountingSetComponent } from './accounting-set.component';

describe('AccountingSetComponent', () => {
  let component: AccountingSetComponent;
  let fixture: ComponentFixture<AccountingSetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountingSetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountingSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
