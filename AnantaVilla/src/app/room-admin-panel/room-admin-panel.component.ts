// room-admin-panel.component.ts

import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';  
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { NavbarComponent } from "../navbar/navbar.component";
import { AdminPanelNavbarComponent } from "../admin-panel-navbar/admin-panel-navbar.component";
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
  selector: 'app-room-admin-panel',
  standalone: true,
  templateUrl: './room-admin-panel.component.html',
  styleUrl: './room-admin-panel.component.css',
  imports: [CommonModule, FormsModule, AdminPanelNavbarComponent]
})
export class RoomAdminPanelComponent  implements OnInit  {
  handleImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    // Optionally set a fallback image
    event.target.src = 'path/to/fallback-image.png';
  }
  selectedRoom: Room | null = null;
  isEditModalOpen = false;
  editField: string = '';
  editValue: string = '';
   rooms: Room[] = [];
   toasts: { message: string; type: 'success' | 'error' }[] = [];
  selectedImage: string = '';
  isImageViewerOpen: boolean = false;
  scale: number = 1;
  translateX: number = 0;
  translateY: number = 0;
  isPanning: boolean = false;
  startX: number = 0;
  startY: number = 0;
  lastTranslateX: number = 0;
  lastTranslateY: number = 0;
  minDate: string = '';
  invalidCheckinDate: boolean = false;
  invalidCheckoutDate: boolean = false;
  showToast(message: string, type: 'success' | 'error') {
    const toast = { message, type };
    this.toasts.push(toast);

    // Automatically remove the toast after 3 seconds
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t !== toast);
    }, 3000);
  }

  public RoomDetails: {
    title: string;
    price: number;
    size: string;
    bed: string;
    adults: number;
    children: number;
    roomcheckindate: Date;
    roomcheckoutdate: Date;
    
  } = {
    title: '',
    price: 0,
    size: '',
    bed: '',
    adults: 0,
    children: 0,
    roomcheckindate: new Date(),
    roomcheckoutdate: new Date(),
  };

  constructor(private router: Router) {}

  // In your component
  ngOnInit(): void {
    axios.get('http://localhost:3000/api/rooms') // Changed 'Rooms' to 'rooms'
      .then(response => {
        this.rooms = response.data;
        console.log('Room data:', this.rooms);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }
  openImageViewer(imageUrl: string) {
    this.selectedImage = imageUrl;
    this.isImageViewerOpen = true;
    this.resetZoom();
  }

  closeImageViewer() {
    this.isImageViewerOpen = false;
    this.resetZoom();
  }

  zoomIn() {
    if (this.scale < 3) {
      this.scale += 0.25;
    }
  }

  zoomOut() {
    if (this.scale > 0.5) {
      this.scale -= 0.25;
    }
  }

  resetZoom() {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  handleZoom(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  startPan(event: MouseEvent) {
    this.isPanning = true;
    this.startX = event.clientX - this.translateX;
    this.startY = event.clientY - this.translateY;
  }

  pan(event: MouseEvent) {
    if (!this.isPanning) return;
    
    this.translateX = event.clientX - this.startX;
    this.translateY = event.clientY - this.startY;
  }

  endPan() {
    this.isPanning = false;
    this.lastTranslateX = this.translateX;
    this.lastTranslateY = this.translateY;
  }
  // In room-admin-panel.component.ts, add this method
  deleteRoom(roomId: string) {
    if (confirm('Are you sure you want to delete this room?')) {
        axios.delete(`http://localhost:3000/api/rooms/${roomId}`)
            .then(response => {
                if (response.data.success) {
                    this.rooms = this.rooms.filter(room => room._id !== roomId);
                    this.showToast('Room deleted successfully', 'success');
                }
                else{
                  this.showToast(response.data.message||'Failed To Deleted Room','error');
                }
            })
            .catch(error => {
                console.error('Error deleting room:', error.response?.data || error.message);
                const errorMessage = error.response?.data?.message || 'Failed to delete room';
                this.showToast(errorMessage,'error');
            });
          }
      }
      openEditModal(room: Room, field: string) {
        this.selectedRoom = room;
        this.editField = field;
        
        // Type-safe property access
        switch(field) {
          case 'Name':
            this.editValue = room.Name;
            break;
          case 'Bed':
            this.editValue = room.Bed;
            break;
          case 'Price':
            this.editValue = room.Price;
            break;
          case 'Size':
            this.editValue = room.Size;
            break;
          default:
            this.editValue = '';
        }
        
        this.isEditModalOpen = true;
      }
      closeEditModal() {
        this.selectedRoom = null;
        this.isEditModalOpen = false;
        this.editField = '';
        this.editValue = '';
      }
      saveRoomChanges() {
        if (!this.selectedRoom || !this.editField) return;
    
        const updates = {
          [this.editField]: this.editValue
        };
    
        axios.put(`http://localhost:3000/api/rooms/${this.selectedRoom._id}`, updates)
          .then(response => {
            if (response.data.success) {
              // Update the room in the local array
              const index = this.rooms.findIndex(room => room._id === this.selectedRoom?._id);
              if (index !== -1) {
                this.rooms[index] = {
                  ...this.rooms[index],
                  [this.editField]: this.editValue
                };
              }
              this.showToast('Room updated successfully', 'success');
              this.closeEditModal();
            }
          })
          .catch(error => {
            console.error('Error updating room:', error);
            this.showToast('Failed to update room', 'error');
          });
      }
  }
