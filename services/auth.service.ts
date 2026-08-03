import { apiClient } from '@/lib/axios';
import {
  ForgotPasswordInput,
  LoginInput,
  RegisterInput,
} from '@/lib/validations/auth.validation';
import { ApiEnvelope, AuthResponseData, User } from '@/types/auth.types';

export const authService = {
  async register(input: RegisterInput): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiEnvelope<AuthResponseData>>('/auth/register', {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      password: input.password,
      ...(input.phone && { phone: input.phone }),
    });
    return response.data.data;
  },

  async login(input: LoginInput): Promise<AuthResponseData> {
    const response = await apiClient.post<ApiEnvelope<AuthResponseData>>('/auth/login', input);
    return response.data.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<ApiEnvelope<{ user: User }>>('/auth/me');
    return response.data.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  async forgotPassword(input: ForgotPasswordInput): Promise<string> {
    const response = await apiClient.post<ApiEnvelope<null>>('/auth/forgot-password', input);
    return response.data.message;
  },

  async resetPassword(token: string, password: string): Promise<string> {
    const response = await apiClient.post<ApiEnvelope<null>>('/auth/reset-password', {
      token,
      password,
    });
    return response.data.message;
  },

  async verifyEmail(token: string): Promise<string> {
    const response = await apiClient.post<ApiEnvelope<null>>('/auth/verify-email', {
      token,
    });
    return response.data.message;
  },
};
