import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPaymentComponent } from './car-payment.component';

describe('CarPaymentComponent', () => {
  let component: CarPaymentComponent;
  let fixture: ComponentFixture<CarPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
