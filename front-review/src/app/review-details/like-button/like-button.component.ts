import { Component, Input, OnInit } from '@angular/core';
import { ReviewDetailsService } from '../review-details.service';
import { Like } from 'src/app/shared/interfaces/resLike.model';
import { AuthService } from 'src/app/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent implements OnInit {
  @Input() reviewId: string;
  @Input() userId: string;

  isLiked: boolean = false;
  likesCount: number = 0;

  constructor(
    private reviewDetailsService: ReviewDetailsService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.checkLike();

    // Get the number of likes for this review
    this.reviewDetailsService.getLikesCount(this.reviewId).subscribe((count: any) => {
      this.likesCount = count.likesCount;
    });
  }

  checkLike() {
    this.reviewDetailsService.checkIfLiked(this.userId, this.reviewId).subscribe((result: Like) => {
      this.isLiked = result.isLiked;
    });
  }

  openDialog() {
    this.dialog.open(DialogComponent);
  }

  toggleLike() {
    const user = this.authService.getUserId();
    if (user) {
      if (this.isLiked) {
        this.reviewDetailsService.unlikeReview(this.userId, this.reviewId).subscribe(() => {
          this.isLiked = false;
          this.likesCount--;
        });
      } else {
        this.reviewDetailsService.likeReview(this.userId, this.reviewId).subscribe(() => {
          this.isLiked = true;
          this.likesCount++;
        });
      }
    } else {
      this.openDialog();
    }
  }
}
