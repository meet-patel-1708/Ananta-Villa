import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserContactDetailsComponent } from './user-contact-details.component';

describe('UserContactDetailsComponent', () => {
  let component: UserContactDetailsComponent;
  let fixture: ComponentFixture<UserContactDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserContactDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserContactDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
