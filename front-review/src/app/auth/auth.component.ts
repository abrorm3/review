import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AuthResponse } from './auth.model';
import {
  SocialUser,
  SocialAuthService,
  GoogleLoginProvider,
} from '@abacritt/angularx-social-login';

declare const google: any;
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginForm!: FormGroup;
  socialUser!: SocialUser;
  isLoggedin?: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.socialAuthService.authState.subscribe((user) => {
      this.socialUser = user;
      this.isLoggedin = user != null;
      console.log(this.socialUser);
    });
  }

  ngAfterViewInit() {
    this.initializeGoogleSignIn();
  }

  private initializeGoogleSignIn(): void {
    google.accounts.id.initialize({
      client_id: '478306182791-gp3oe0veh3j5042f2licqcd7eflljdt6.apps.googleusercontent.com',
      callback: this.handleCredentialResponse,
    });

    google.accounts.id.renderButton(
      document.getElementById('googleSignInButtonContainer'), // Use the correct ID
      { theme: 'outline', size: 'large' }
    );
  }

  private handleCredentialResponse(response: any): void {
    console.log('Encoded JWT ID token: ' + response.credential);
    // Handle the JWT response as needed
  }

  loginWithGoogle(): void {
    google.accounts.id.prompt(); // Trigger the manual Google Sign-In process
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
}
