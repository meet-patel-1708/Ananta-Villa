import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth.guard';
import { RoomsComponent } from './rooms/rooms.component';
import { CartComponent } from './cart/cart.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component'; // Import AdminPanelComponent
import { RoomAdminPanelComponent } from './room-admin-panel/room-admin-panel.component';
import { BookingAdminPanelComponent } from './booking-admin-panel/booking-admin-panel.component';
import { ContactusComponent } from './contactus/contactus.component';
import { UserContactDetailsComponent } from './user-contact-details/user-contact-details.component';
import { MyBookingsComponentComponent } from './my-bookings-component/my-bookings-component.component';

const routes: Routes = [
  { path: '', redirectTo: '/Login', pathMatch: 'full' },
  { path: 'Login', component: LoginComponent, canActivate: [authGuard] },
  { path: 'Home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'Rooms', component: RoomsComponent, canActivate: [authGuard] },
  { path: 'cart', component: CartComponent, canActivate: [authGuard]  },
  { path: 'Admin', component: AdminPanelComponent, canActivate: [authGuard]  }, // Use AdminPanelComponent here
  { path: 'RoomsAdmin', component: RoomAdminPanelComponent, canActivate: [authGuard]  },
  { path: 'BookingsAdmin', component: BookingAdminPanelComponent, canActivate: [authGuard]  },
  { path: 'Contact Us', component: ContactusComponent , canActivate: [authGuard] },
  { path: 'ContactAdmin', component: UserContactDetailsComponent , canActivate: [authGuard] },
  { path: 'My Bokkings', component: MyBookingsComponentComponent, canActivate: [authGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })], // Hash-based routing
  exports: [RouterModule]
})
export class AppRoutingModule {}
