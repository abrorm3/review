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
  userStatus:string[]=['USER']
  adminImg:string='https://firebasestorage.googleapis.com/v0/b/review-e9e60.appspot.com/o/650d4eb29e165e4c42ff215c%2Fasdas%2FcoverImage%2Fcrown_6941697.png_1695376903170?alt=media&token=a95ae9e9-7b05-4d25-a681-95513ea7cd0c'
  constructor(private authService: AuthService, private router:Router, private feedService:FeedService) {}

  ngOnInit(): void {
    this.getUser();
    this.feedService.isPanelOpen$.subscribe((bool) => {
      this.panelOpenState = bool;
    });
    this.setStatus();
  }
  setStatus(){
    this.authService.checkAdmin().subscribe((res)=>{

      if(res){
        this.userStatus.push('ADMIN')
      }
    })
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
  navigateToFeed(){
    this.router.navigate(['/feed']);
  }

}
