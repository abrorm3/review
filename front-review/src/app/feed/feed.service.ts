import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Review } from '../shared/interfaces/review.model';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private groupTypeSubject = new BehaviorSubject<string>('');
  private isPanelOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isPanelOpen$: Observable<boolean> = this.isPanelOpenSubject.asObservable();

  togglePanel() {
    this.isPanelOpenSubject.next(!this.isPanelOpenSubject.value);
  }
  groupType$ = this.groupTypeSubject.asObservable();

  backend = environment.apiBaseUrl;
  constructor(private http:HttpClient) { }

  getReviews():Observable<Review[]> {
    return this.http.get<Review[]>(`${this.backend}/feed/get-reviews`)
  }
  setGroupType(groupType: string) {
    this.groupTypeSubject.next(groupType);
  }

}
