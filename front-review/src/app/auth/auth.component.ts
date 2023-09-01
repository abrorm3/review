import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from './auth.model';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';

declare const FB: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  private accessToken = '';
  user: SocialUser;
  loggedIn: boolean;
  isLoading = false;
  isLoginMode = true;
  visible: boolean = false;
  changetype: boolean = false;
  errorMessage: string = '';

  email: string;
  password: string;
  askedUsername: boolean = false;
  userId: string;
  username: string = ''

  usernameAvailability: boolean | null = null;

  constructor(
    private socialAuthService: SocialAuthService,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = user != null;
      if (this.loggedIn) {
        this.router.navigate(['/feed']);
        console.log(this.user);

      }
    });
  }

  // Request google Access Token
  getAccessToken(): void {
    this.socialAuthService
      .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
      .then((accessToken) => (this.accessToken = accessToken));
  }

  getGoogleCalendarData(): void {
    if (!this.accessToken) return;

    this.httpClient
      .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .subscribe((events) => {
        alert('Look at your console');
        console.log('events', events);
      });
  }
  // Refresh google Access Token
  refreshToken(): void {
    this.socialAuthService.refreshAccessToken(GoogleLoginProvider.PROVIDER_ID);
  }
  handleFacebookLogin(response: any) {
    if (response.status === 'connected') {
      console.log('Facebook login successful');
      this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    } else {
      console.log('Facebook login failed');
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoginMode) {
      //LOGIN
      this.authService.login({ email, password }).subscribe({
        next: (resData: AuthResponse) => {
          // console.log('Logged in!', resData.token, resData.userId);
          this.isLoading = false;
          this.router.navigate(['/feed']);
          this.userId = this.authService.getUserId();
        },
        error: (errorMessage: any) => {
          this.errorMessage = errorMessage;
          this.isLoading = false;
          console.error('Login failed:', errorMessage);
        },
      });
    }

    if (!this.isLoginMode) {
      //SIGN UP
      this.authService.signup({ email, password }).subscribe({
        next: (resData) => {
          console.log('Registered!', resData.token);
          this.isLoading = false;
          this.askedUsername = true;
          this.userId = this.authService.getUserId();
          // this.router.navigate(['/feed']);
        },
        error: (errorMessage) => {
          this.errorMessage = errorMessage.toString().split(': ')[1];
          this.isLoading = false;
          console.error('Registration failed:', errorMessage);
        },
      });
    }

    form.reset();
  }
  viewpassword() {
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
  setUsername(form: NgForm) {
    console.log('logged');

    const username = form.value.username;
    this.authService.updateUsername(this.userId, username).subscribe({
      next:(response) => {
        console.log('Update successful:', response);
        this.router.navigate(['/feed']);
      },
      error:(error) => {
        console.error('Update failed:', error);
      }})
  }
  checkUsernameAvailability() {
    const username = this.username.toLowerCase();
    this.usernameAvailability = null;

    this.authService.checkUsernameAvailability(username).subscribe(
      (response: any) => {
        this.usernameAvailability = response.available;
      },
      error => {
        console.error('Error checking username availability:', error);
      }
    );
  }
  navigateToForgotPassword(){
    this.router.navigate(['/forgot-password']);
  }
}
