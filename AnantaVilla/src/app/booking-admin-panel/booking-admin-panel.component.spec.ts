import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingAdminPanelComponent } from './booking-admin-panel.component';

describe('BookingAdminPanelComponent', () => {
  let component: BookingAdminPanelComponent;
  let fixture: ComponentFixture<BookingAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingAdminPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
