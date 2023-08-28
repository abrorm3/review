export interface AuthRequest {
  email: string;
  password: string;
  username: string;
}


export interface AuthResponse {
  token: string;
  userId: string;
}
