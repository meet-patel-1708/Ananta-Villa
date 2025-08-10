import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomAdminPanelComponent } from './room-admin-panel.component';

describe('RoomAdminPanelComponent', () => {
  let component: RoomAdminPanelComponent;
  let fixture: ComponentFixture<RoomAdminPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoomAdminPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoomAdminPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
