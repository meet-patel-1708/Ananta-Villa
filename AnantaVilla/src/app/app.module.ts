import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Import the standalone LoginComponent here
import { LoginComponent } from './login/login.component'; 
import { HomeComponent } from './home/home.component';
import { RoomsComponent } from './rooms/rooms.component';
import { CartComponent } from './cart/cart.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { HttpClientModule,HttpClient } from '@angular/common/http';
import { RoomAdminPanelComponent } from './room-admin-panel/room-admin-panel.component';
import { BookingAdminPanelComponent } from './booking-admin-panel/booking-admin-panel.component';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ContactusComponent } from './contactus/contactus.component';
import { UserContactDetailsComponent } from './user-contact-details/user-contact-details.component';
import { AdminPanelNavbarComponent } from './admin-panel-navbar/admin-panel-navbar.component';
import { MyBookingsComponentComponent } from './my-bookings-component/my-bookings-component.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    HttpClientModule,
    
    BrowserModule,
    AppRoutingModule,
    LoginComponent ,// Import LoginComponent here
    HomeComponent,
    RoomsComponent,
    CartComponent,
    AdminPanelComponent,
    RoomAdminPanelComponent,
    BookingAdminPanelComponent,
    NavbarComponent,
    FooterComponent,
    ContactusComponent,
    UserContactDetailsComponent,
    AdminPanelNavbarComponent,
    MyBookingsComponentComponent,
  ],
  providers: [HttpClient],
})
export class AppModule { }
