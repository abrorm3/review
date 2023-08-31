import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string = '';
  errorExists:boolean=false;
  constructor(private authService: AuthService, private _location: Location) {}
  sendPasswordResetLink() {
    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.message = response.message;
        this.errorExists = false;
      },
      error: (error) => {
        console.error(error);
        this.errorExists = true;
        this.message = error.error.message;
      },
    });
  }
  navigateBack(){
    this._location.back();
  }
}
