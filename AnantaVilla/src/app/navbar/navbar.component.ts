import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit,HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
interface Toast {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  imports: [CommonModule, FormsModule, RouterModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isMobileMenuOpen = false;
  isLoggedIn = false;
  user: any;
  isDropdownOpen = false;
  loginType: 'google' | 'otp' = 'google';
  toasts: Toast[] = [];
  lang:string= '';
  constructor(private router: Router) {}
  showToast(message: string, type: 'success' | 'error') {
    this.toasts.push({ message, type });
    setTimeout(() => this.hideToast(message), 5000);
  }

  hideToast(message: string) {
    this.toasts = this.toasts.filter(toast => toast.message !== message);
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    const menuButton = document.querySelector('.menu-button');
    menuButton?.classList.toggle('active');
  }

  ngOnInit() {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.loginType = this.user.photo ? 'google' : 'otp';
      }
    } catch (error) {
      console.error('Error in ngOnInit:', error);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnDestroy() {}

  logout() {
    localStorage.removeItem('user');
    this.showToast('You have been logged out successfully!', 'success');
    this.router.navigate(['/Login']);
  }

  navigateToHome() {
    this.router.navigate(['./Home']);
  }

  navigateToCart() {
    this.router.navigate(['./cart']);
  }

  navigateToRooms() {
    this.router.navigate(['./Rooms']);
  }

  navigateToContact() {
    this.router.navigate(['./Contact Us']);
  }
  navigateToBookings() {
    this.router.navigate(['./My Bokkings']);
  }
}