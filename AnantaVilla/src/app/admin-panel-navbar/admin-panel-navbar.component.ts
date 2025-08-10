import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-panel-navbar',
  standalone: true,
  
  templateUrl: './admin-panel-navbar.component.html',
  styleUrl: './admin-panel-navbar.component.css'
})
export class AdminPanelNavbarComponent {
   constructor(
      private router: Router
    ) {}
  navigateTORooms(){
    this.router.navigate(['./RoomsAdmin']);
  }
  navigateTOBookings(){
    this.router.navigate(['./BookingsAdmin']);
  }
  navigateTOContact(){
    this.router.navigate(['./ContactAdmin']);
  }
}
