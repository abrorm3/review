import { Component, OnInit } from '@angular/core';
import { ReviewDetailsService } from './review-details.service';
import { Review } from '../shared/interfaces/review.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css'],
})
export class ReviewDetailsComponent implements OnInit {
  reviewData: Review;
  user:string;
  userId:string;
  avatarImg;
  constructor(
    private reviewDetailsService: ReviewDetailsService,
    private authService:AuthService,
    private route: ActivatedRoute,private sanitizer: DomSanitizer,
    private router:Router
  ) {}
  sanitizedContent: SafeHtml | undefined;
  opened: boolean = true;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const reviewTitle = params['title'];
      this.reviewDetailsService.getReview(reviewTitle).subscribe({
        next:(response) => {
          this.reviewData = response.review;
          console.log(this.reviewData);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this.reviewData.content);
          this.authorAvatar()
        },
        error:(error)=>{
          console.log(error);

        }
      });
    });
    this.getUserId();

  }
  navigateToPersonDetails(authorId) {
    this.authService.getUsername(authorId).subscribe((data) => {
      this.router.navigate(['/person', data.username]);
    })
  }
  getUserId(){
    this.userId= this.authService.getUserId();
  }
  authorAvatar(){
    console.log(this.reviewData.authorUsername);

    this.authService.getUsername(this.reviewData.authorUsername).subscribe((user) =>{
      this.user = user.username;
      this.reviewDetailsService.getAvatar(this.user).subscribe((data)=>{
        this.avatarImg = data;
        console.log(data + 'our data');
      })
    })
  }
}
