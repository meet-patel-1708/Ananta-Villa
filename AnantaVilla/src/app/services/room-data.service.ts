import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RoomDataService {

  constructor(private http:HttpClient) { }
  room(){
    return this.http.get('http://localhost:3000/room')
  }
}
