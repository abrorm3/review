import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonComponent } from './person.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { ReviewModule } from '../create-review/review.module';
import { MatIconModule } from '@angular/material/icon';
import { PersonReviewsComponent } from './person-reviews/person-reviews.component';

@NgModule({
  declarations: [PersonComponent, PersonReviewsComponent],
  imports: [CommonModule, MatCardModule, MatSliderModule, MatSidenavModule, ReviewModule, MatIconModule,],
})
export class PersonModule {}
