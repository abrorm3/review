import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Review } from '../shared/interfaces/review.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getReviews():Observable<Review[]> {
    return this.http.get<Review[]>(`${this.backend}/feed/get-reviews`)
  }
}
