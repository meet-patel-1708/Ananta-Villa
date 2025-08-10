import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from "../footer/footer.component";
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  selector: 'app-my-bookings-component',
  standalone: true,
  templateUrl: './my-bookings-component.component.html',
  styleUrl: './my-bookings-component.component.css',
  imports: [NavbarComponent, FooterComponent,CommonModule,FormsModule]
})
export class MyBookingsComponentComponent implements OnInit{
  rooms: Room[] = [];
  formatDate(dateString:string):string{
    return dateString.split('T')[0];
  }
  ngOnInit(): void {
      axios.get('http://localhost:3000/api/bookings').then(
        response=>{
          if(response.data && Array.isArray(response.data)){
            this.rooms= response.data.map(room=>({
              ...room,
              checkInDate: this.formatDate(room.checkInDate),
              checkOutDate: this.formatDate(room.checkOutDate),
            }));
            console.log('Room Data:',this.rooms);
          }
          else{
            console.log('No data found');
          }
        }
      ).catch(
        error=>{
          console.error(
          'Error fetching data'
          );
          
        }
      );
  }
}
