export interface Review {
  name: string;
  art: string;
  authorId:string;
  authorUsername?:string;
  content: string;
  coverImage: string;
  createDate?: string;
  authorRate: number;
  group: string;
  tags: string[];
  timeAgo?: string;
}
