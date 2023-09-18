import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Review } from '../shared/interfaces/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  sendReview(review:Review){
    console.log('Sending request:', review);
    return this.http.post(`${this.backend}/review/create-review`, review)
    .pipe(
      catchError((error: any) => {
        console.error('Error:', error);
        return throwError(error);
      })
    );
  }
  fetchGroupArt(){
    return this.http.get(`${this.backend}/review/fetch-review-models`)
  }
  fetchAllTags(){
    return this.http.get(`${this.backend}/review/fetch-tags`)
  }
}
