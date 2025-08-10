import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';
import { ChangeDetectorRef } from '@angular/core';
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
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
declare var Razorpay: any;
@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css'],
  imports: [FormsModule, CommonModule, NavbarComponent, FooterComponent]
})
export class RoomsComponent implements OnInit {
  handleImageError(event: any) {
    console.error('Image failed to load:', event.target.src);
    // Optionally set a fallback image
    event.target.src = 'path/to/fallback-image.png';
  }
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
  isModalOpen = false;
  totalAmount: number = 0;
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

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  // In your component
  ngOnInit(): void {
    axios.get('http://localhost:3000/api/Rooms')
      .then(response => {
        this.rooms = response.data;
        console.log('Room data:', this.rooms); // Check the image paths
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
      });
  }
  getFormattedDate(date: Date): string {
    return date.toISOString().split('T')[0];
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

  validateInputs() {
    if (!this.RoomDetails.adults || this.RoomDetails.adults <= 0) {
      this.showToast("Please enter a valid number of adults", 'error');
      return false;
    }
    if (this.RoomDetails.children < 0) {
      this.showToast("Please enter a valid number of children", 'error');
      return false;
    }
    return true;
  }

  validateDates() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkinDate = new Date(this.RoomDetails.roomcheckindate);
    const checkoutDate = new Date(this.RoomDetails.roomcheckoutdate);

    // Check if check-in is in the past
    this.invalidCheckinDate = checkinDate < today;

    // Check if check-out is before or same as check-in
    this.invalidCheckoutDate = checkoutDate <= checkinDate;

  }
  // Add this helper method
private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
  async sendBookingEmail(roomDetails: Room, paymentResponse: any) {
    // Get the user's email from your application's state/auth system
    //const userEmail = this.getCurrentUserEmail(); // You need to implement this method
    

    const getAbsoluteImageURL = (imagePath?: string) => {
      if (!imagePath) {
        return '';
      }
      if (imagePath.startsWith('/image')) {
        return `http://localhost:3000${imagePath}`;
      }
      if (imagePath.startsWith('http')) {
        return imagePath;
      }
      return `http://localhost:3000/image/${imagePath}`;
    };

    const absoluteImageUrl = getAbsoluteImageURL(roomDetails.Image1);

    const emailData = {
      to: "meetpatel692020@gmil.com", // Use the validated email
      subject: "Room Booking Confirmation - Ananta Villa",
      bookingDetails: {
        roomName: roomDetails.Name,
        price: this.totalAmount,
        size: roomDetails.Size,
        bedType: roomDetails.Bed,
        image: absoluteImageUrl,
        adults: this.RoomDetails.adults,
        children: this.RoomDetails.children,
        checkInDate: new Date(this.RoomDetails.roomcheckindate).toLocaleDateString(),
        checkOutDate: new Date(this.RoomDetails.roomcheckoutdate).toLocaleDateString(),
        paymentID: paymentResponse.razorpay_payment_id
      }
    };

    try {
      const response = await axios.post(
        'http://localhost:3000/api/send-booking-email',
        emailData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("Email Sent Successfully", response.data);
      this.showToast('Booking Confirmation email sent!', 'success');
    } catch (error: any) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.details || 'Failed to send confirmation email';
      this.showToast(errorMessage, 'error');
    }
  }

  saveBookingDetails(room: Room) {
    // Validate inputs first
    this.validateDates();
    if (this.RoomDetails.adults < 0 || this.RoomDetails.children < 0) {
      this.showToast("Adults and Children must be positive numbers...!", "error");
      return false; // Return false to indicate failure
    }

    if (this.invalidCheckinDate || this.invalidCheckoutDate) {
      this.showToast("Invalid Checkin or Checkout Date...!", "error");
      return false; // Return false to indicate failure
    }

    // Format data according to the Booking schema from your backend
    const bookingData = {
      roomId: room._id,
      adults: this.RoomDetails.adults,
      children: this.RoomDetails.children,
      checkInDate: this.RoomDetails.roomcheckindate,
      checkOutDate: this.RoomDetails.roomcheckoutdate,
      roomDetails: {
        title: room.Name,
        price: this.totalAmount,
        size: room.Size,
        bed: room.Bed,
        image: room.Image1
      }
    };

    // Make the API call to save booking
    return axios.post('http://localhost:3000/api/bookings', bookingData)
      .then(response => {
        console.log('Booking saved:', response.data);
        this.showToast("Your booking has been saved successfully and it will appear in My Bookings", "success");
        return true; // Return true to indicate success
      })
      .catch(error => {
        console.error('Error saving booking:', error);
        this.showToast("Failed to book your room", "error");
        return false; // Return false to indicate failure
      });
  }
  bookRoom(roomId: string) {
    this.validateDates();
    if (!this.validateInputs()) { return; }

    const selectedRoom = this.rooms.find(room => room._id === roomId);
    if (!selectedRoom) {
      this.showToast("Room not found", 'error');
      return;
    }

    const roomPrice = Number(selectedRoom.Price.replace(/[^0-9.-]+/g, ""));
    const checkinDate = new Date(this.RoomDetails.roomcheckindate);
    const checkoutDate = new Date(this.RoomDetails.roomcheckoutdate);
    const daysOfStay = Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 3600 * 24));

    if (daysOfStay <= 0) {
      this.showToast("Invalid Check-in and Check-out dates.", 'error');
      return;
    }

    this.totalAmount = daysOfStay * roomPrice;

    const options = {
      description: "Razorpay Payment Integration",
      currency: "INR",
      amount: this.totalAmount * 100,
      name: "Ananta Villa",
      key: "rzp_test_XUfZ7mIm2x3Fig",
      image: './assets/image/A2.png',
      prefill: {
        name: "Ananta Villa",
        email: "meetpatel@gmail.com",
        phone: '9426215580'
      },
      theme: {
        color: '#f37254'
      },
      modal: {
        ondismiss: () => {
          console.log('Payment dismissed');
        }
      },
      handler: async (response: any) => {
        console.log('Payment successful:', response);
        try {
          await this.sendBookingEmail(selectedRoom, response);

          // Save the booking details after successful payment and email
          const bookingSaved = await this.saveBookingDetails(selectedRoom);

          if (bookingSaved) {
            this.isModalOpen = true; // Show the success modal
            this.cdr.detectChanges(); // Ensure the modal shows up immediately
          }
        } catch (error) {
          console.error('Error in booking process:', error);
          this.showToast('Payment successful but there was an error completing your booking', 'error');
        }
      }
    };

    try {
      const rzp = new Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        this.showToast('Payment failed', 'error');
      });
    } catch (error) {
      console.error('Razorpay error:', error);
      this.showToast('Payment system error', 'error');
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.cdr.detectChanges();
  }
  addToCart(room: Room) {
    // Perform input validation
    this.validateDates();

    if (this.RoomDetails.adults < 0 || this.RoomDetails.children < 0) {
      this.showToast('Adults and children must be positive numbers.', 'error');
      return;
    }

    if (this.invalidCheckinDate || this.invalidCheckoutDate) {
      this.showToast('Please correct the date errors before adding to the cart.', 'error');
      return;
    }

    // If all validations pass, proceed with adding to cart
    const cartData = {
      email: 'user@example.com',
      roomId: room._id,
      details: {
        title: room.Name,
        price: room.Price,
        adults: this.RoomDetails.adults,
        children: this.RoomDetails.children,
        checkInDate: this.RoomDetails.roomcheckindate,
        checkOutDate: this.RoomDetails.roomcheckoutdate,
        image: room.Image1,
        size: room.Size,
        bed: room.Bed,
      },
    };

    axios.post('http://localhost:3000/api/cart/add', cartData)
      .then(response => {
        this.showToast('Room added to cart successfully!', 'success');
        this.router.navigate(['/cart']);
      })
      .catch(error => {
        console.error('Error adding to cart:', error);
        this.showToast('Failed to add room to cart.', 'error');
      });
  }

}




/**
 *  FOR BOOKING SUCCESS MODAL
 * 
 */