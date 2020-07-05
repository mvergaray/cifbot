import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesListPageComponent } from './purchases-list-page.component';

describe('PurchasesListPageComponent', () => {
  let component: PurchasesListPageComponent;
  let fixture: ComponentFixture<PurchasesListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasesListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
