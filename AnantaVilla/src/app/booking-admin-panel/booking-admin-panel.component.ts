import { Component, OnInit } from '@angular/core';
import { AdminPanelNavbarComponent } from "../admin-panel-navbar/admin-panel-navbar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
interface Room {
  roomId: string,
  adults:number,
  children: number,
  checkInDate: string,
  checkOutDate: string,
  roomDetails: {
    title: string,
    price: number,
    size: string,
    bed: number,
    image?:string,
  }
}
@Component({
  selector: 'app-booking-admin-panel',
  standalone: true,
  templateUrl: './booking-admin-panel.component.html',
  styleUrl: './booking-admin-panel.component.css',
  imports: [AdminPanelNavbarComponent,CommonModule,FormsModule]
})
export class BookingAdminPanelComponent implements OnInit{
rooms:Room[]=[];
formatDate(dateString:string):string{
  return dateString.split('T')[0];
}
ngOnInit(): void {
    axios.get('http://localhost:3000/api/bookings').then(response=>{
      if(response.data && Array.isArray(response.data)){
        this.rooms = response.data.map(room=>({
          ...room,
          checkInDate:this.formatDate(room.checkInDate),
          checkOutDate:this.formatDate(room.checkOutDate),
        }))
      }
      else{
        console.log('No Bookings Found...!');
      }
    }).catch(
      error=>{
        console.log('No Bookings Found...!');
      }
    );
}
}
