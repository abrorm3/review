import { Component, OnInit } from '@angular/core';
import { ImageUploadService } from '../shared/image-upload.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css'],
})
export class AccountSettingsComponent implements OnInit {
  name: string = '';
  email: string = '';
  aboutMe: string = '';
  profilePictureUrl: string = '';
  memberSince: string = '';
  username: string = '';

  selectedFile: File | null = null;

  constructor(
    private imageUploadService: ImageUploadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setInfo();
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (this.isImageFile(file)) {
      this.selectedFile = file;
      this.profilePictureUrl = URL.createObjectURL(file);

    } else {
      this.setInfo();
      alert('Please select a valid image file.');
    }
  }
  isImageFile(file: File): boolean {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']; // Add more if needed
    return allowedImageTypes.includes(file.type);
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
  setInfo() {
    this.authService.getUser().subscribe((user) => {
      console.log(user);
      this.profilePictureUrl = user.accountPhoto;
      this.name = user.username;
      this.email = user.email;
      const memberDate = new Date(user.registrationTime);
      const year = memberDate.getFullYear();
      this.memberSince = year.toString();
      this.username = user.username;
      console.log(this.name);
    });
  }
}
