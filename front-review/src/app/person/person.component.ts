import { Component, OnInit } from '@angular/core';
import { PersonService } from './person.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css'],
})
export class PersonComponent implements OnInit{
  constructor(private personService: PersonService, private authService:AuthService) {}

  ngOnInit(): void {

  }
  getUsername(name){
    this.authService.getUsername(name).subscribe((username)=>{
      
    })
  }
}
