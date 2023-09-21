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
  opened:boolean=true;
  constructor(
    private personService: PersonService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.getUsername();
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
}
