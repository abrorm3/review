import { Component, OnInit } from '@angular/core';
import { ReviewDetailsService } from './review-details.service';
import { Review } from '../shared/interfaces/review.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css'],
})
export class ReviewDetailsComponent implements OnInit {
  reviewData: Review;
  constructor(
    private reviewDetailsService: ReviewDetailsService,
    private route: ActivatedRoute
  ) {}
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const reviewTitle = params['title'];
      this.reviewDetailsService.getReview(reviewTitle).subscribe({
        next:(response) => {
          this.reviewData = response.review;
          console.log(this.reviewData);

        },
        error:(error)=>{
          console.log(error);

        }
      });

      // Subscribe to the BehaviorSubject to receive updates.
      // this.reviewDetailsService.reviewData$.subscribe((data) => {
      //   this.reviewData = data;
      //   console.log(this.reviewData);

      // });
    });
  }
}
