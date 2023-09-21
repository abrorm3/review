export interface User {
  _id?: string;
  name: string;
  email: string;
  aboutUser: string;
  profilePictureUrl: string;
  username: string;
  roles: string;
  lastLoginTime: Date;
  registrationTime: Date;
}
