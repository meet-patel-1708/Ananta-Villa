import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {BehaviorSubject} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLang = new BehaviorSubject<string>('en');
  constructor(private translate:TranslateService) {
    translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('selectedLanguage') || translate.getBrowserLang() || 'en';
    this.setLanguage(savedLang);
  }
  setLanguage(lang:string){
    this.translate.use(lang);
    localStorage.setItem('selectedLanguage',lang);
    this.currentLang.next(lang);
  }
  getCurrentLang(){
    return this.currentLang.asObservable();
  }
}
