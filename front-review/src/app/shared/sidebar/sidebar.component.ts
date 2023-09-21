import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../interfaces/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  opened: boolean = true;
  isAuthenticated: boolean = false;
  userInfo:User;
  constructor(private authService: AuthService, private router:Router) {}

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.authService.getUser().subscribe({
      next: (res) => {
        if (res) {
          this.isAuthenticated = true;
          this.userInfo = res;
        } else {
          this.isAuthenticated = false;
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  navigateToSettings(){
    this.router.navigate(['/account/settings']);
  }
}
