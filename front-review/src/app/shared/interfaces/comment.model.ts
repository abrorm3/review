import { User } from "./user.model";

export interface Comment {
  id?: string;
  userId: User;
  content: string;
  reviewId:string;
  timestamp?: Date;
}
