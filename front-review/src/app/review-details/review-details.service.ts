import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Review } from '../shared/interfaces/review.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';
import { Comment } from '../shared/interfaces/comment.model';


@Injectable({
  providedIn: 'root',
})
export class ReviewDetailsService {
  backend = environment.apiBaseUrl;
  private reviewData: Review | null = null;

  constructor(private http: HttpClient) {}

  getReview(reviewName: string): Observable<any> {
    return this.http
      .get<Review>(`${this.backend}/review-details/${reviewName}`)
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }
  getAuthorReview(username: string): Observable<any> {
    return this.http
      .get<Review>(`${this.backend}/review-details/person/${username}`)
      .pipe(
        tap((res) => {
          console.log(res);
        })
      );
  }
  getAvatar(username: string): Observable<string> {
    return this.http
      .get<{ avatar: string }>(
        `${this.backend}/review-details/get-avatar/${username}`
      )
      .pipe(
        tap((res) => {
          console.log('avatar - ' + res);
        }),
        map((res) => res.avatar)
      );
  }

  // LIKE Component
  likeReview(userId: string, reviewId: string) {
    console.log('this is serv userid' + userId);

    return this.http.post(`${this.backend}/likes/like/${reviewId}`, { userId });
  }

  unlikeReview(userId: string, reviewId: string) {
    return this.http.delete(`${this.backend}/likes/unlike/${reviewId}`, {
      body: { userId },
    });
  }

  checkIfLiked(userId: string, reviewId: string) {
    return this.http.get(
      `${this.backend}/likes/check-like/${reviewId}?userId=${userId}`
    );
  }

  getLikesCount(reviewId: string) {
    return this.http.get(`${this.backend}/likes/all-likes/${reviewId}`);
  }

  // Comment
  addComment(comment: Comment): Observable<Comment> {
    return this.http.post<Comment>(`${this.backend}/comment`, comment);
  }

  getCommentsByReviewId(reviewId: string): Observable<Comment[]> {
    const url = `${this.backend}/comment/review/${reviewId}`;
    return this.http.get<Comment[]>(url);
  }
  getCommentCount(reviewId:string){
    return this.http.get(`${this.backend}/comment/count/${reviewId}`)
  }
}
