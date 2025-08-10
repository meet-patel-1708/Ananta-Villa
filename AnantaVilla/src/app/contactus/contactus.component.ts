import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports:[NavbarComponent,CommonModule,FormsModule],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
  constructor(private http:HttpClient){}
  public contactData :any[] = []; 
  public ContactData:{
    name:string;
    mobileno:number;
    message:string
  }={
    name:'',
    mobileno:0,
    message:'',
  }
  save(ContactDataForm:any){
    if(ContactDataForm.valid){
      this.http.post('http://localhost:3000/contact',this.ContactData).subscribe(
        (response:any)=>{
          this.contactData.push(response);
          alert('Your Contact Saved Successfully!');
        },
        (error)=>{
          alert('Error in Saveing Data');
          console.log(error);
          
        }
      )
    }
    else{
      alert('Please fill all the fields!');
    }
  }
}
