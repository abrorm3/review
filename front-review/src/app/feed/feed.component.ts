import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FeedService } from './feed.service';
import { Review } from '../shared/interfaces/review.model';
import { ReviewDetailsService } from '../review-details/review-details.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  constructor(private router: Router, private feedService: FeedService, private reviewDetailsService:ReviewDetailsService, private authService:AuthService) {}
  opened: boolean = true;
  reviews: Review[] = [];
  recentReviews: Review[] = [];
  selectedGroupType: string = '';
  searchFilter: string = '';
  commentCount:string='0';

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
    this.feedService.groupType$.subscribe((groupType) => {
      this.selectedGroupType = groupType;

    });
  }
  navigateToReviewDetails(review) {
    const reviewTitle = review.name;
    this.router.navigate(['/review-details', reviewTitle]);
  }
  createReview(){
    const user = localStorage.getItem('user')
    if(user){
      this.router.navigate(['/create-review']);
    }else{
      this.router.navigate(['/auth']);
    }
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
  handleGroupTypeSelected(groupType:string){
    this.selectedGroupType = groupType;
    console.log(this.selectedGroupType+' GRRRUP!');

  }
  togglePanel(){
    this.feedService.togglePanel();
  }
  navigateToDetails(review){
    this.router.navigate([`/review-details/${review}`])
  }
  getCommentCount(reviewId: string){
    this.reviewDetailsService.getCommentCount(reviewId).subscribe((res)=>{
      // this.commentCount = res.;
      console.log(res + ' count');

    })
  }
  navigateToPersonDetails(authorId: string) {
    this.authService.getUsername(authorId).subscribe((data) => {
      this.router.navigate(['/person', data.username]);
    })
  }
}
