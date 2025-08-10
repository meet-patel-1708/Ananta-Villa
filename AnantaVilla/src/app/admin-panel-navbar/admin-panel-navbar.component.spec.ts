import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelNavbarComponent } from './admin-panel-navbar.component';

describe('AdminPanelNavbarComponent', () => {
  let component: AdminPanelNavbarComponent;
  let fixture: ComponentFixture<AdminPanelNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminPanelNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanelNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
