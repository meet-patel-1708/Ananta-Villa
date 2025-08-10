import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminPanelNavbarComponent } from "../admin-panel-navbar/admin-panel-navbar.component";

@Component({
  selector: 'app-user-contact-details',
  standalone: true,
  templateUrl: './user-contact-details.component.html',
  styleUrl: './user-contact-details.component.css',
  imports: [FormsModule, CommonModule, AdminPanelNavbarComponent]
})
export class UserContactDetailsComponent {
  public contactData: any[] = [];
  public contactDataForm = {
    name: "", email: "", mobileno: 0, message: ""
  }
  
  constructor(private http: HttpClient) {}
  
  ngOnInit() {
    this.fetchContactData();
  }

  fetchContactData() {
    this.http.get<any[]>('http://localhost:3000/contact').subscribe(
      (data) => {
        this.contactData = data;
        console.log('Fetched contact data:', data); // Add this for debugging
      },
      (error) => {
        console.error("Error Fetching task:", error);
      }
    );
  }
}
