import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ReviewDetailsService } from 'src/app/review-details/review-details.service';
import { Review } from 'src/app/shared/interfaces/review.model';

@Component({
  selector: 'app-person-reviews',
  templateUrl: './person-reviews.component.html',
  styleUrls: ['./person-reviews.component.css'],
})
export class PersonReviewsComponent implements OnInit {
  userInfo: string;
  reviews: Review[] = [];
  totalLikes:number =0;
  constructor(
    private reviewDetailsService: ReviewDetailsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router:Router
  ) {}
  ngOnInit() {
    this.getUsername();
  }
  fetchAuthorReview() {
    if (this.userInfo) {
      this.reviewDetailsService.getAuthorReview(this.userInfo).subscribe({
        next: (reviews: any) => {
          this.reviews = reviews.review;
          console.log(this.reviews);

        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  getUsername() {
    this.route.params.subscribe((params) => {
      const username = params['username'];
      console.log(username);

      return this.authService.getUsername(username).subscribe({
        next: (response) => {
          this.userInfo = response.username;
          this.totalLikes = response.totalLikes;
          this.fetchAuthorReview();
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
  navigateToReviewDetails(review){
    const reviewTitle = review.name;
    this.router.navigate(['/review-details', reviewTitle]);
  }
}
