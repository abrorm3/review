import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  constructor(private storage: AngularFireStorage) {}

  uploadImage(file: File, path: string): Promise<string> {
    const storageRef = this.storage.ref(path);
    const uploadTask = storageRef.put(file);

    return new Promise((resolve, reject) => {
      uploadTask.snapshotChanges().subscribe({
        next:(snapshot) => {
          if (snapshot.state === 'success') {
            storageRef.getDownloadURL().subscribe((downloadURL) => {
              resolve(downloadURL);
            });
          }
        },
        error:(error) => {
          reject(error);
        }
    });
    });
  }
}
