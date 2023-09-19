import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from './feed.service';
import { Review } from '../shared/interfaces/review.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  constructor(private router: Router, private feedService: FeedService) {}
  opened: boolean = true;
  reviews: Review[] = [];

  ngOnInit() {
    this.feedService.getReviews().subscribe({
      next: (response: any) => {
        this.reviews = response as Review[];
        console.log(this.reviews);
        this.calculateTimeDifference();
      },
    });
  }
  navigateToReviewDetails(review) {}
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
