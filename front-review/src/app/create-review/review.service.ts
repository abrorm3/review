import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  sendReview(details: { authorId: string; name: string; group: string; art: any; content: string; authorRate: number; tags: string; }){
    console.log('Sending request:', details);
    return this.http.post(`${this.backend}/review/create-review`, details)
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
