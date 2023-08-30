import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { AuthRequest, AuthResponse } from './auth.model';
import { Observable, catchError, map, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  backend = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  login(credentials: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.backend}/auth/login`, credentials)
      .pipe(
        catchError(error => {
          if (error.status === 403 && error.error.isBlocked) {
            return throwError(error.error.message);
          }
          return this.handleError(error);
        }),
        map(response => {
          if (response.token) {
            this.setAuthToken(response.token);
            this.setUserId(response.userId);
          }
          return response;
        })
      );
  }


  signup(credentials:AuthRequest){
    return this.http.post<AuthResponse>(`${this.backend}/auth/registration`, credentials)
    .pipe(
      catchError(this.handleError),
      map(response => {
        if (response.token) {
          this.setAuthToken(response.token);
        }
        if (response.userId) {
          this.setUserId(response.userId);
        }
        return response;
      })
    )
  }
  updateUsername(userId: string, newUsername: string):Observable<any>{
    const requestBody = { userId, newUsername };
    console.log(requestBody.userId + " from service");
    console.log(requestBody.newUsername + " from service");

    return this.http.post(`${this.backend}/auth/update-username`, requestBody).pipe(catchError(this.handleError),
    map(response => {
      console.log(response + " got response!!");
      return response;
    }))
  }
  logout(){
    this.removeAuthToken();
  }
  setAuthToken(token: string): void {
    localStorage.setItem('user', token);
  }
  setUserId(userId: string): void {
    localStorage.setItem('userId', userId);
  }

  removeAuthToken(): void {
    localStorage.removeItem('user');
  }

  isAuthenticated(): Observable<boolean> {
    const token = localStorage.getItem('user');
    const authenticated = !!token;
    return of(authenticated);
  }
  // checkAuthStatus(): Observable<boolean> {
  //   const token = localStorage.getItem('token'); // Assume you're storing the token in local storage after login
  //   if (!token) {
  //     return of(false);
  //   }

  //   return this.http.get<boolean>(`${backend}/auth/check-auth-status`, {
  //     headers: { Authorization: token }
  //   }).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  private handleError(errorRes: HttpErrorResponse){
    let errorMessage = 'An unknown error occurred!';
    if (errorRes.error && errorRes.error.message) {
      errorMessage = errorRes.error.message;
    }
    return throwError(() => new Error(errorMessage));
  }
  getUserId(): string {
    return localStorage.getItem('userId');
  }
  checkUsernameAvailability(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.backend}/auth/check-username/${username}`);
  }
}
