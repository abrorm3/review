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


}
