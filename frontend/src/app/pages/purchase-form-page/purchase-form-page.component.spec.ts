import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseFormPageComponent } from './purchase-form-page.component';

describe('PurchaseFormPageComponent', () => {
  let component: PurchaseFormPageComponent;
  let fixture: ComponentFixture<PurchaseFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchaseFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
