import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from './auth.model';
import { GoogleAuthService } from './google-auth.service';

declare var gapi: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLoading = false;
  isLoginMode = true;
  visible: boolean = false;
  changetype: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private googleAuthService: GoogleAuthService
  ) {}

  ngOnInit() {
    this.googleAuthService.initClient();
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
          this.router.navigate(['/user-management']);
        },
        error: (errorMessage: any) => {
          this.errorMessage = errorMessage;
          this.isLoading = false;
          console.error('Login failed:', errorMessage);
        },
      });
    }

    if (!this.isLoginMode) {
      //SIGN IN
      this.authService.signup({ email, password }).subscribe({
        next: (resData) => {
          console.log('Registered!', resData.token);
          this.isLoading = false;
          this.router.navigate(['/user-management']);
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
  gSignIn() {
    this.googleAuthService.signIn();
  }
}
