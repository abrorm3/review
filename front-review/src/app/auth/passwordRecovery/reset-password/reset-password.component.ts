import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent {
  id: string = '';
  token: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  showSuccessMessage: boolean = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router:Router) {
    this.route.params.subscribe((params) => {
      this.id = params['id'];
      this.token = params['token'];
      console.log(this.id+ " id.");
      console.log(this.token+ " token.");

    });
  }

  resetPassword() {
    this.authService
      .resetPassword(this.id, this.token, this.newPassword)
      .subscribe({
        next: () => {
          this.errorMessage='';
          this.showSuccessMessage = true;
          setTimeout(() => {
            this.router.navigate(['/auth']);
          }, 4000);
        },
        error: (error) => {
          console.error(error);
          this.errorMessage = error.error.message;
        },
      });
  }
}
