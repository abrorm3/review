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
      next:(response:any)=>{
        this.reviews = response as Review[];
        console.log(this.reviews);
      }
    })
  }
  navigateToReviewDetails(review){}

}
