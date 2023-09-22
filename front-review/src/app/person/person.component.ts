import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';
import { AuthService } from '../auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../shared/interfaces/user.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
})
export class PersonComponent implements OnInit {
  userInfo: User;
  adminMessage: any;
  userStatus:string[]=['USER'];
  opened:boolean=true;
  constructor(
    private personService: PersonService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getUsername();
    this.setStatus();


  }
  setStatus(){
    this.authService.checkAdmin().subscribe((res)=>{
      console.log(res + ' - IS ADMIN?');

      if(res){
        this.userStatus.push('ADMIN')
      }
      console.log(this.userStatus);
    })
  }
  getUsername() {
    this.route.params.subscribe((params) => {
      const username = params['username'];
      console.log(username);

      this.authService.getUsername(username).subscribe({
        next: (response) => {
          this.userInfo = response;
        },
        error: (error) => {
          console.log(error);
        },
      });
    });
  }
  makeAdmin(username){
    this.authService.makeAdmin(username).subscribe({
      next:(res)=>{
        this.adminMessage = res;
        console.log(res);

      },error:(err)=>{
        this.adminMessage = err.error.message;
        console.log(this.adminMessage);

      }
    })
  }
}
