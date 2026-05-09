export interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
}

export interface AuthState {
  token: string | null;
  user: User | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
