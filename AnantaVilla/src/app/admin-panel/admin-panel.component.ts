import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AdminPanelNavbarComponent } from "../admin-panel-navbar/admin-panel-navbar.component";
@Component({
  selector: 'app-admin-panel',
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, AdminPanelNavbarComponent]
})
export class AdminPanelComponent implements OnInit {
  roomForm!: FormGroup;
  showToast = false;
  toastMessage = '';
  toastTimeout: any;
  selectedFiles: { [key: string]: File | null } = {};

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.roomForm = this.fb.group({
      Name: ['', [Validators.required, Validators.minLength(3)]],
      Price: ['', [Validators.required]],
      Size: ['', [Validators.required]],
      Bed:['',[Validators.required]]
    });
  }

  onFileChange(event: Event, fieldName: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles[fieldName] = input.files[0];
    } else {
      this.selectedFiles[fieldName] = null;
    }
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const formData = new FormData();
      
      // Append form fields
      Object.keys(this.roomForm.value).forEach(key => {
        formData.append(key, this.roomForm.value[key]);
      });

      // Append images
      ['Image1', 'Image2', 'Image3', 'Image4'].forEach(field => {
        if (this.selectedFiles[field]) {
          formData.append(field, this.selectedFiles[field]!);
        }
      });

      this.http.post('http://localhost:3000/api/rooms', formData)
        .subscribe({
          next: (response) => {
            this.showToastMessage('Room added successfully!');
            this.roomForm.reset();
            this.selectedFiles = {};
          },
          error: (error) => {
            console.error('Error adding room:', error);
            this.showToastMessage('Failed to add room. Please try again.');
          }
        });
    } else {
      this.showToastMessage('Please fill out all required fields correctly!');
    }
  }

  showToastMessage(message: string): void {
    this.toastMessage = message;
    this.showToast = true;
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}