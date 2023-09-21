import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from '../interfaces/user.model';
import { Router } from '@angular/router';
import { FeedService } from 'src/app/feed/feed.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  opened: boolean = true;
  panelOpenState:boolean = false;
  isAuthenticated: boolean = false;
  userInfo:User;
  selectedGroupType: string = '';

  constructor(private authService: AuthService, private router:Router, private feedService:FeedService) {}

  ngOnInit(): void {
    this.getUser();
    this.feedService.isPanelOpen$.subscribe((bool) => {
      this.panelOpenState = bool;
    });
  }
  selectGroupType(groupType: string) {
    this.feedService.setGroupType(groupType);
    this.selectedGroupType = groupType;
  }
  getUser() {
    const userStored = localStorage.getItem('user');
    if(userStored){
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
  }
  navigateToSettings(){
    this.router.navigate(['/account/settings']);
  }

}
