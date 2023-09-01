import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from '../shared/image-upload.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit{
  name: string = '';
  email: string = '';
  aboutMe: string = '';
  profilePictureUrl: string = '';
  memberSince: string = '';
  username: string = '';

  selectedFile: File | null = null;

  constructor(private imageUploadService: ImageUploadService, private authService:AuthService) {}

  ngOnInit(): void {

  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  saveSettings() {}
  uploadImage() {
    if (this.selectedFile) {
      this.imageUploadService
        .uploadImage(this.selectedFile, 'users')
        .then((downloadURL) => {
          console.log('Image uploaded:', downloadURL);
          // Do something with the downloadURL (e.g., save it in a database)
        })
        .catch((error) => {
          console.error('Error uploading image:', error);
        });
    }
  }
  setImage(){
    this.authService.getUser().subscribe((user)=>{
      console.log(user);
      this.profilePictureUrl = user.accountPhoto;
    })
  }
}
