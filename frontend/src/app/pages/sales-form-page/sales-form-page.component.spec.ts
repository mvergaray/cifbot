import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesFormPageComponent } from './sales-form-page.component';

describe('SalesFormPageComponent', () => {
  let component: SalesFormPageComponent;
  let fixture: ComponentFixture<SalesFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesFormPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
