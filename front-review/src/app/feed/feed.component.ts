import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from './feed.service';
import { Review } from '../shared/interfaces/review.model';
import { ReviewDetailsService } from '../review-details/review-details.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  constructor(private router: Router, private feedService: FeedService, private reviewDetailsService:ReviewDetailsService) {}
  opened: boolean = true;
  reviews: Review[] = [];
  recentReviews: Review[] = [];

  ngOnInit() {
    this.feedService.getReviews().subscribe({
      next: (response: any) => {
        this.reviews = response as Review[];

        this.recentReviews = response as Review[];
        this.reviews.reverse();
        this.recentReviews = this.recentReviews.slice(0, 10);
        console.log(this.recentReviews);
        this.calculateTimeDifference();
      },
    });
  }
  navigateToReviewDetails(review) {
    const reviewTitle = review.name;
    this.router.navigate(['/review-details', reviewTitle]);
  }
  createReview(){
    this.router.navigate(['/create-review']);
  }
  calculateTimeDifference() {
    const now = new Date();

    this.reviews.forEach((review) => {
      const createDate = new Date(review.createDate);
      const timeDifference = now.getTime() - createDate.getTime();
      const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
      const daysDifference = Math.floor(hoursDifference / 24);

      if (daysDifference > 0) {
        review.timeAgo = `${daysDifference}d ago`;
      } else {
        review.timeAgo = `${hoursDifference}h ago`;
      }
    });
  }
}
