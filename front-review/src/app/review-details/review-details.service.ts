import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Review } from '../shared/interfaces/review.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ReviewDetailsService {
  backend = environment.apiBaseUrl;
  private reviewData: Review[];

  constructor(private http: HttpClient) {}

  getReview(reviewName): Observable<Review[]> {
    console.log('serviceeee');

    return this.http.get<Review[]>(`${this.backend}/review-details/${reviewName}`)
    .pipe(
      tap((data)=>{
        console.log('data - '+data);

        this.reviewData = data;
      })
    )
  }
  getStoredReviewData(): Review[] {
    return this.reviewData;
  }

}
