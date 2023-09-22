export interface User {
  _id?: string;
  name: string;
  email: string;
  aboutUser: string;
  profilePictureUrl: string;
  username: string;
  roles: string;
  totalLikes: number;
  lastLoginTime: Date;
  registrationTime: Date;
}
