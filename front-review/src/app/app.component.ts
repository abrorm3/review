import { Component } from '@angular/core';
import { TranslateService } from './translate.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'front-review';

  constructor(private translationService: TranslateService){}

  switchLanguage(language: string) {
    this.translationService.useLanguage(language);
  }
}
