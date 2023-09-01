import { Component } from '@angular/core';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {
  name:string='';
  email:string='';
  aboutMe:string='';
  profilePictureUrl:string='';
  memberSince:string='';
  username:string='';
  saveSettings(){

  }
}
