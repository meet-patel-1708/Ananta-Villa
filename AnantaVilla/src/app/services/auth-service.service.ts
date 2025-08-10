import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  login(userData: any) {
    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData));

    // Navigate to the Home page
    this.router.navigate(['/Home']);
  }

  logout() {
    // Remove user data from localStorage
    localStorage.removeItem('user');

    // Navigate to the Login page
    this.router.navigate(['/Login']);
  }
}