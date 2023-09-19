export interface AuthRequest {
  email: string;
  password: string;
}


export interface AuthResponse {
  token: string;
  userId: string;
  expiresIn: number;
}
