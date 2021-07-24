import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarIntroduceComponent } from './car-introduce.component';

describe('CarIntroduceComponent', () => {
  let component: CarIntroduceComponent;
  let fixture: ComponentFixture<CarIntroduceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarIntroduceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarIntroduceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
