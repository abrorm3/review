import { Injectable } from '@angular/core';
import { TranslateService as NgxTranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {

  private currentLanguageSubject: BehaviorSubject<string>;

  constructor(private ngxTranslate: NgxTranslateService) {
    this.currentLanguageSubject = new BehaviorSubject<string>(this.ngxTranslate.currentLang || 'en');
    this.ngxTranslate.setDefaultLang('en');
  }

  getCurrentLanguage() {
    return this.currentLanguageSubject.asObservable();
  }

  useLanguage(language: string) {
    this.ngxTranslate.use(language);
    this.currentLanguageSubject.next(language);
  }

  getTranslation(key: string | string[], interpolateParams?: object) {
    return this.ngxTranslate.instant(key, interpolateParams);
  }
}
