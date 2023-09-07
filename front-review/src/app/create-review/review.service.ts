import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  fetchGroupType(){
    return this.http.get(`${this.backend}/review/fetch-review-models`)
  }
}
