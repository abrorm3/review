import { Injectable } from '@angular/core';

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private auth2: any;

  constructor() { }

  initClient(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      gapi.load('auth2', () => {
        gapi.auth2.init({
          client_id: '450222958902-klksftivvikp9p28f5rtknvsdtmtrjpu.apps.googleusercontent.com',
        }).then(
          () => {
            this.auth2 = gapi.auth2.getAuthInstance();
            resolve();
          },
          error => {
            reject(error);
          }
        );
      });
    });
  }

  signIn(): Promise<any> {
    return this.auth2.signIn();
  }

  signOut(): Promise<any> {
    return this.auth2.signOut();
  }
}
