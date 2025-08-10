import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { NavbarComponent } from "../navbar/navbar.component";
import { FooterComponent } from '../footer/footer.component';

interface CartItem {
  _id: string;
  email: string;
  roomId: string;
  details: {
    title: string;
    price: string;
    adults: number;
    children: number;
    checkInDate: Date;
    checkOutDate: Date;
    image?: string;
    Size:String;
    Bed:number
  };
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
declare var Razorpay:any;
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  imports: [CommonModule, FormsModule, NavbarComponent,FooterComponent],
  standalone: true
})
export class CartComponent implements OnInit {
bookNow() {
throw new Error('Method not implemented.');
}
rooms: CartItem[] = [];
  email = 'user@example.com';
  cartItems: CartItem[] = [];
  toasts: { message: string; type: 'success' | 'error' }[] = [];
  selectedItem: CartItem | null = null;
  isModalOpen = false;
  fieldToEdit: keyof CartItem['details'] | null = null;
  isModalOpen1 = false;
  totalAmount:number=0;
  ngOnInit(): void {
    this.getCartItems();
  }
constructor(private cdr: ChangeDetectorRef){}
  showToast(message: string, type: 'success' | 'error') {
    this.toasts.push({ message, type });
    setTimeout(() => this.hideToast(message), 5000);
  }

  hideToast(message: string) {
    this.toasts = this.toasts.filter(toast => toast.message !== message);
  }

  getCartItems() {
    axios.get(`http://localhost:3000/api/cart/${this.email}`)
      .then(response => {
        this.cartItems = response.data.data;
        console.log('Cart items:', this.cartItems);
        this.showToast('Cart items loaded successfully.', 'success');
      })
      .catch(error => {
        console.error('Error fetching cart items:', error);
        this.showToast('Error fetching cart items.', 'error');
      });
  }

  openEditModal(item: CartItem, field: keyof CartItem['details']) {
    this.selectedItem = { ...item };
    this.fieldToEdit = field;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedItem = null;
    this.fieldToEdit = null;
  }

  saveCartItemChanges() {
    if (!this.selectedItem || !this.fieldToEdit) return;

    const updatedField = this.fieldToEdit;
    const updatedValue = this.selectedItem.details[updatedField];

    axios.put(`http://localhost:3000/api/cart/update/${this.selectedItem._id}`, {
      [updatedField]: updatedValue
    })
      .then(() => {
        this.showToast('Cart item updated successfully.', 'success');
        this.getCartItems();
        this.closeModal();
      })
      .catch(error => {
        console.error('Error updating cart item:', error);
        this.showToast('Error updating cart item.', 'error');
      });
  }

  removeFromCart(itemId: string) {
    axios.delete(`http://localhost:3000/api/cart/remove/${itemId}`)
      .then(() => {
        this.showToast('Item removed from cart successfully.', 'success');
        this.getCartItems();
      })
      .catch(error => {
        console.error('Error removing item from cart:', error);
        this.showToast('Error removing item from cart.', 'error');
      });
  }
  async sendBookingEmail(roomDetails: CartItem, paymentResponse: any) {
    const getAbsoluteImageURL = (imagePath?: string) => {
        if (!imagePath) {
            return '';
        }
        // If the path starts with '/image', prepend the server URL
        if (imagePath.startsWith('/image')) {
            return `http://localhost:3000${imagePath}`;
        }
        // If it's already an absolute URL, return as is
        if (imagePath.startsWith('http')) {
            return imagePath;
        }
        // Otherwise, assume it's a relative path and prepend both server URL and /image
        return `http://localhost:3000/image/${imagePath}`;
    };

    // Log the image path for debugging
    console.log('Original image path:', roomDetails.details.image);
    const absoluteImageUrl = getAbsoluteImageURL(roomDetails.details.image);
    console.log('Converted image URL:', absoluteImageUrl);

    const emailData = {
        to: "meet692020@gmail.com",
        subject: "Room Booking Confirmation - Ananta Villa",
        bookingDetails: {
            roomName: roomDetails.details.title,
            price: this.totalAmount,
            size:roomDetails.details.Size,
            bedType: roomDetails.details.Bed,
            image: absoluteImageUrl,
            adults: roomDetails.details.adults,
            children:  roomDetails.details.adults,
            checkInDate: new Date( roomDetails.details.checkInDate).toLocaleDateString(),
            checkOutDate: new Date(roomDetails.details.checkOutDate).toLocaleDateString(),
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
    } catch (error) {
        console.error('Error sending email:', error);
        this.showToast('Booking Confirmation email was not sent!', 'error');
    }
}

bookRoom(roomId: string) {
  const selectedRoom = this.cartItems.find(item => item._id === roomId);
  if (!selectedRoom) {
    this.showToast("Room not found", 'error');
    return;
  }

  const roomPrice = Number(selectedRoom.details.price.replace(/[^0-9.-]+/g, ""));
  const checkinDate = new Date(selectedRoom.details.checkInDate);
  const checkoutDate = new Date(selectedRoom.details.checkOutDate);
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
        this.isModalOpen1 = true; // Show the success modal
        this.cdr.detectChanges(); // Ensure the modal shows up immediately
      } catch (error) {
        console.error('Error in booking process:', error);
        this.showToast('Booking confirmed but email failed to send', 'error');
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

closeModal1() {
  this.isModalOpen1 = false;
  this.cdr.detectChanges();
}
}