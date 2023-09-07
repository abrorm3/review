import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {
  @Input() rating: number; // The current rating
  @Output() ratingChange = new EventEmitter<number>(); // Emit changes to the rating

  // Set the rating when a star is clicked
  setRating(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(this.rating);
  }
}
