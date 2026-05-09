import { apiClient } from './client';
import { AuthResponse, LoginPayload, SignupPayload } from '../types/auth.types';
import { ApiResponse } from '../types/api.types';

export const authApi = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signup', payload);
    return data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', payload);
    return data.data;
  },

  async verifyEmail(token: string): Promise<void> {
    await apiClient.get('/auth/verify-email', { params: { token } });
  },

  async sendVerificationEmail(email: string): Promise<void> {
    await apiClient.post('/auth/verify-email', { email });
  },
};
