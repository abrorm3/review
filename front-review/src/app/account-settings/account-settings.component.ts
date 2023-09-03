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
  aboutUser: string = '';
  imgRender: string = '';
  memberSince: string = '';
  username: string = '';
  profilePictureUrl: string = '';
  downloadImg: string = '';
  isLoading: boolean = false;

  errorMessage: string = '';
  successMessage:string='';

  selectedFile: File | null = null;

  constructor(
    private imageUploadService: ImageUploadService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setInfo();
    console.log(this.name + ' old Name');
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log('changed');

    if (this.isImageFile(file)) {
      this.selectedFile = file;
      this.imgRender = URL.createObjectURL(file);
    } else {
      this.setInfo();
      this.errorMessage='Please select a valid image file.';
    }
  }

  isImageFile(file: File): boolean {
    const allowedImageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
    ]; // Add more if needed
    return allowedImageTypes.includes(file.type);
  }
  async saveSettings() {
    this.isLoading=true;
    try {
      const downloadURL = await this.uploadImage();
      this.authService
        .updateAllInfo(
          this.authService.getUserId(),
          this.name,
          this.email,
          this.aboutUser,
          downloadURL,
          this.username
        )
        .subscribe({
          next: (response) => {
            this.successMessage = response.message;
          },
          error: (error) => {
            this.errorMessage = error.error.message;
          },
        })
        this.isLoading=false;
    } catch (err) {
      console.error('Error uploading image:', err);
      // this.isLoading=false;
    }
  }
  async uploadImage(): Promise<string> {
    const userId = this.authService.getUserId();
    if (this.selectedFile) {
      try {
        const downloadURL = await this.imageUploadService.uploadImage(
          this.selectedFile,
          `userPhoto/${userId}`
        );
        console.log('Image uploaded:', downloadURL);
        this.setImgDownload(downloadURL);
        return downloadURL;
      } catch (err) {
        throw err;
      }
    }
    return '';
  }
  setImgDownload(url: string) {
    console.log(url + ' set img d');

    this.downloadImg = url;
  }
  setInfo() {
    this.authService.getUser().subscribe((user) => {
      console.log(user);
      this.imgRender = user.profilePictureUrl;
      this.name = user.name;
      this.email = user.email;
      this.aboutUser = user.aboutUser;
      const memberDate = new Date(user.registrationTime);
      const year = memberDate.getFullYear();
      this.memberSince = year.toString();
      this.username = user.username;
      console.log(this.name);
    });
  }
}
