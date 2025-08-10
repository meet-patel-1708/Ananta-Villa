import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyBookingsComponentComponent } from './my-bookings-component.component';

describe('MyBookingsComponentComponent', () => {
  let component: MyBookingsComponentComponent;
  let fixture: ComponentFixture<MyBookingsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyBookingsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyBookingsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
