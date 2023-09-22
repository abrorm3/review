import { Component, OnInit } from '@angular/core';
import { ReviewDetailsService } from './review-details.service';
import { Review } from '../shared/interfaces/review.model';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../auth/auth.service';
import { Comment } from '../shared/interfaces/comment.model';
import { User } from '../shared/interfaces/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-review-details',
  templateUrl: './review-details.component.html',
  styleUrls: ['./review-details.component.css'],
})
export class ReviewDetailsComponent implements OnInit {
  reviewData: Review;
  user: string;
  userId: string;
  avatarImg;
  sanitizedContent: SafeHtml | undefined;
  opened: boolean = true;

  comments: Comment[] = [];
  userProfileMap: Map<string, User> = new Map<string, User>();
  newCommentText = '';
  likesCount: number=0;
  private likeToggleSubscription: Subscription;

  constructor(
    private reviewDetailsService: ReviewDetailsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit() {
    this.likeToggleSubscription = this.reviewDetailsService.likeToggle$.subscribe(({ userId, reviewId, isLiked }) => {
      // Update the likesCount based on the event
      if (!isLiked) {
        this.likesCount++;
      } else {
        this.likesCount--;
      }
    });
    this.route.params.subscribe((params) => {
      const reviewTitle = params['title'];
      this.reviewDetailsService.getReview(reviewTitle).subscribe({
        next: (response) => {
          this.reviewData = response.review;
          console.log(this.reviewData);
          this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(
            this.reviewData.content
          );
          this.getUserId();
          this.authorAvatar();
          this.loadComments();
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
  navigateToPersonDetails(authorId) {
    this.authService.getUsername(authorId).subscribe((data) => {
      this.router.navigate(['/person', data.username]);
    });
  }
  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
  getUserId() {
    this.userId = this.authService.getUserId();
  }
  authorAvatar() {
    console.log(this.reviewData.authorUsername);

    this.authService
      .getUsername(this.reviewData.authorUsername)
      .subscribe((user) => {
        this.user = user.username;
        this.likesCount = user.totalLikes;
        this.reviewDetailsService.getAvatar(this.user).subscribe((data) => {
          this.avatarImg = data;
          console.log(data + 'our data');
        });
      });
  }
  addComment() {
    if (this.newCommentText.trim() === '') {
      return;
    }
    this.authService.getUser().subscribe((user: User) => {
      const newComment: Comment = {
        userId: user,
        content: this.newCommentText,
        reviewId: this.reviewData._id,
      };

      this.reviewDetailsService.addComment(newComment).subscribe((comment) => {
        this.comments.push(comment);
        this.newCommentText = '';
        this.loadComments();
      });
    });
  }

  loadComments() {
    if (this.reviewData) {
      this.reviewDetailsService
        .getCommentsByReviewId(this.reviewData._id)
        .subscribe((comments) => {
          this.comments = comments;
        });
    }
  }
  ngOnDestroy() {
    // Unsubscribe from the like toggle event to prevent memory leaks
    this.likeToggleSubscription.unsubscribe();
  }

}
