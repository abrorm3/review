import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';
import { Review } from '../shared/interfaces/review.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReviewDetailsService {
  backend = environment.apiBaseUrl;
  private reviewData: Review | null = null;

  constructor(private http: HttpClient) {}

  getReview(reviewName: string): Observable<any> {
    return this.http.get<Review>(`${this.backend}/review-details/${reviewName}`).pipe(
      tap((res)=>{
        console.log(res);

      })
    )
  }
  getAvatar(username: string): Observable<string> {
    return this.http
      .get<{ avatar: string }>(`${this.backend}/review-details/get-avatar/${username}`)
      .pipe(
        tap((res) => {
          console.log('avatar - ' + res);
        }),
        map((res) => res.avatar)
      );
  }

  // LIKE Component
  likeReview(userId: string, reviewId: string) {
    console.log('this is serv userid'+userId);

    return this.http.post(`${this.backend}/likes/like/${reviewId}`, { userId});
  }

  unlikeReview(userId: string, reviewId: string) {
    return this.http.delete(`${this.backend}/likes/unlike/${reviewId}`, { body: { userId } });
  }

  checkIfLiked(userId: string, reviewId: string) {
    return this.http.get(`${this.backend}/likes/check-like/${reviewId}?userId=${userId}`);
  }

  getLikesCount(reviewId: string) {
    return this.http.get(`${this.backend}/likes/all-likes/${reviewId}`);
  }
  // router.post("/like/:reviewId", controller.like);
  // router.delete("/unlike/:reviewId", controller.unlike)
  // router.get("/all-likes/:reviewId", controller.allLikes)

}
