import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getReviews():Observable<any> {
    return this.http.get(`${this.backend}/feed/get-reviews`)
  }
}
