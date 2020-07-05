import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesListPageComponent } from './sales-list-page.component';

describe('SalesListPageComponent', () => {
  let component: SalesListPageComponent;
  let fixture: ComponentFixture<SalesListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
