import { Component, OnInit } from '@angular/core';
import { ReviewDetailsService } from './review-details.service';
import { Review } from '../shared/interfaces/review.model';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css'],
})
export class ReviewDetailsComponent implements OnInit {
  reviewData: Review[];
  constructor(private reviewDetailsService: ReviewDetailsService) {}
  ngOnInit() {
    this.reviewData = this.reviewDetailsService.getStoredReviewData();
    console.log(this.reviewData);

  }
}
