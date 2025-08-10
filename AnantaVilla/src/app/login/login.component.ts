import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../services/auth-service.service';
import { environment } from '../envoirnment/envoirnment';
interface CredentialResponse {
  credential: string;
}

declare global {
  interface Window {
    handleCredentialResponse: (response: CredentialResponse) => void;
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class LoginComponent implements OnInit {
  isLoggedIn: boolean = false;
  public mobileNumber: string = '';
  public name: string = '';
  public email: string = '';
  public ageNumber: string = '';
  public generatedOtp: string = '';
  public verify: string = '';
  public showModal: boolean = false;
  private isOtpSent: boolean = false;
  public loginError:boolean=false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      this.isLoggedIn = !!user;
  
      if (this.isLoggedIn) {
        this.router.navigate(['/Home']);
      }
  
      window.handleCredentialResponse = async (response: CredentialResponse) => {
        if (response.credential) {  
          try {
            const backendUrl = 'https://localhost:3000/login';  // Update this to match your server
            console.log('Attempting login to:', backendUrl);
            
            const result = await axios.post(backendUrl, {
              credential: response.credential
            }, {
              withCredentials: true, // Add this line
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Origin': window.location.origin
              }
            });
      
            if (result.data.user) {
              localStorage.setItem('user', JSON.stringify(result.data.user));
              this.router.navigate(['/Home']);
            }
          } catch (error: any) {
            console.error('Login error:', error);
            this.loginError = true; // Add this line to show error in UI
            // More detailed error handling
            if (error.response) {
              console.error('Error response:', error.response.data);
              alert(`Login failed: ${error.response.data.message || 'Please try again'}`);
            } else if (error.request) {
              console.error('No response received:', error.request);
              alert('Unable to reach the server. Please check your connection.');
            } else {
              console.error('Error:', error.message);
              alert('An unexpected error occurred. Please try again.');
            }
          }
        }
      };
    }
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  otp(otpForm: NgForm): void {
    if (!otpForm.valid) {
      return;
    }
    
    const enteredMobileNumber = otpForm.value.mobile;
    this.mobileNumber = '+91' + enteredMobileNumber.replace(/^\+91/, '');
    this.name = otpForm.value.name?.toString() || '';
    this.email = otpForm.value.email || '';
    this.ageNumber = otpForm.value.age || '';
    
    this.sendotp();
  }

  async sendotp(): Promise<void> {
    const accountSID = '<Twilio SID>';
    const authToken = '<Twilio Auth Token>';
    const twilloNumber = '<Twilio Number>';
  
    this.generatedOtp = this.generateOtp();
    const msgBody = `Your OTP is: ${this.generatedOtp}. Verify this OTP to login!`;
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSID}/Messages.json`;
  
    const data = new URLSearchParams();
    data.append('To', this.mobileNumber);
    data.append('From', twilloNumber);
    data.append('Body', msgBody);
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: 'Basic ' + btoa(`${accountSID}:${authToken}`),
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: data.toString(),
      });
  
      const responseData = await response.json();
      if (response.ok) {
        console.log('OTP Sent Successfully:', responseData);
        alert('OTP Sent Successfully');
        this.isOtpSent = true;
        this.openOtpModal();
      } else {
        console.log('Error Sending OTP:', responseData);
        alert('Error sending OTP. Please check your mobile number and try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert('Error sending OTP. Please try again.');
    }
  }

  verifyOtp(): void {
    if (!this.isOtpSent) {
      alert('Please request OTP first');
      return;
    }
  
    if (this.generatedOtp === this.verify) {
      alert('You Are Successfully Logged in');
  
      const userData = {
        name: this.name,
        email: this.email,
        mobile: this.mobileNumber,
        age: this.ageNumber
      };
      this.authService.login(userData);
      
      this.closeModal();
    } else {
      alert('Invalid OTP');
    }
  }

  openOtpModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.verify = '';
  }
}