import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../navbar/navbar.component";
import axios from 'axios';
import { FooterComponent } from '../footer/footer.component';

interface Slide {
  title: string;
  description: string;
}

interface Room {
  _id: string;
  Name: string;
  Bed: string;
  Price: string;
  Size: string;
  Image1?: string;
  Image2?: string;
  Image3?: string;
  Image4?: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [FormsModule, CommonModule, RouterModule, NavbarComponent,FooterComponent],
  standalone: true
})
export class HomeComponent implements OnInit, OnDestroy {
  hotelImagePath = 'assets/image/3.png';
  isLoggedIn = false;
  user: any;
  isDropdownOpen = false;
  loginType: 'google' | 'otp' = 'google';
  currentSlideIndex = 0;
  private slideInterval: any;

  slides: Slide[] = [
    {
      title: "Keeping You Safe",
      description: "The well-being of our guests and staff is of paramount importance. Our Covid-19 strategy includes deep cleaning rooms between guests and leaving rooms vacant between stays."
    },
    {
      title: "Cancel Within 24H",
      description: "We understand that sometimes things do not go to plan. You can book your stay with confidence with our 24-hour cancellation policy."
    },
    {
      title: "Full Room Amenities",
      description: "Our rooms are designed to give maximum comfort and independence. You'll find a microwave, fridge freezer, kettle, and teas and coffees in every room."
    }
  ];

  rooms: Room[] = [];
  currentIndex = 0;
  translateX = 0;

  currentMonth = new Date().getMonth();
  currentYear = new Date().getFullYear();
  weeks: any[] = [];
  weekDays: string[] = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  currentMonthName: string = '';
  selectedDate: Date | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    axios.get('http://localhost:3000/api/Rooms')
    .then(response => {
      this.rooms = response.data;
      console.log('Room data:', this.rooms);
    })
    .catch(error => {
      console.error('Error fetching rooms:', error);
    });

    this.startAutoSlide();

    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.loginType = this.user.photo ? 'google' : 'otp';
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }

    this.loadCalendar();
  }

  ngOnDestroy() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startAutoSlide(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex = (this.currentSlideIndex + 1) % this.slides.length;
    }, 5000);
  }

  goToSlide(index: number): void {
    this.currentSlideIndex = index;
    clearInterval(this.slideInterval);
    this.startAutoSlide();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.removeItem('user');
    alert('You have been logged out successfully!');
    this.router.navigate(['/Login']);
  }

  navigateToLogin() {
    this.router.navigate(['./Login']);
  }
  
  navigateToCart(){
    this.router.navigate(['./cart']);
  }
  
  navigateToRooms(){
    this.router.navigate(['./Rooms']);
  }

  slide(direction: 'left' | 'right') {
    if (direction === 'left' && this.currentIndex > 0) {
      this.currentIndex--;
    } else if (direction === 'right' && this.currentIndex < this.rooms.length - 1) {
      this.currentIndex++;
    }

    this.translateX = -this.currentIndex * 100;
  }

  loadCalendar() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const calendarDays: any[] = [];
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      calendarDays.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(this.currentYear, this.currentMonth, i);
      const isToday =
        i === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear();

      calendarDays.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        isSelected: false,
        isPast: currentDate < today
      });
    }

    while (calendarDays.length % 7 !== 0) {
      calendarDays.push({
        date: calendarDays.length - daysInMonth,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    this.weeks = [];
    for (let i = 0; i < calendarDays.length; i += 7) {
      this.weeks.push(calendarDays.slice(i, i + 7));
    }

    this.currentMonthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(
      new Date(this.currentYear, this.currentMonth)
    );
  }

  prevMonth() {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.loadCalendar();
  }

  nextMonth() {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.loadCalendar();
  }

  selectDate(day: any) {
    if (!day.isCurrentMonth) return;
    const selectedDate = new Date(this.currentYear,this.currentMonth,day.date);
    const today = new Date();
    today.setHours(0,0,0,0);
    if(selectedDate<today){
      alert('Please Select Future date');
      return;
    }
    this.weeks.forEach((week)=> {
      week.forEach((d:any)=>(d.isSelected = false))
    });
    day.isSelected = true;
    this.selectedDate = selectedDate;
    console.log('selected date:', this.selectedDate);
  }
}
