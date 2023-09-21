import { Component, Input } from '@angular/core';
import { ReviewDetailsService } from '../review-details.service';
import { Like } from 'src/app/shared/interfaces/resLike.model';

@Component({
  selector: 'app-like-button',
  templateUrl: './like-button.component.html',
  styleUrls: ['./like-button.component.css']
})
export class LikeButtonComponent {
  @Input() reviewId: string;
  @Input() userId: string; // Assuming you have the user's ID

  isLiked: boolean = false;
  likesCount: number = 0;

  constructor(private reviewDetailsService: ReviewDetailsService) {}

  ngOnInit(): void {
    console.log(this.userId);

    this.reviewDetailsService.checkIfLiked(this.userId, this.reviewId).subscribe((result:Like) => {
      this.isLiked = result.isLiked;
    });

    // Get the number of likes for this review
    this.reviewDetailsService.getLikesCount(this.reviewId).subscribe((count:any) => {
      this.likesCount = count.likesCount;
    });
  }

  toggleLike() {
    console.log(this.userId);

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
  }
}
