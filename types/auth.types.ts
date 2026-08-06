export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string | null;
  phone: string | null;
  role: UserRole;
  emailVerified: boolean;
  avatar: string | null;
  createdAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponseData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiEnvelope<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register' | 'forgot';
  login: (data: AuthResponseData) => void;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  openAuthModal: (tab?: 'login' | 'register' | 'forgot', onSuccess?: () => void) => void;
  closeAuthModal: () => void;
  requireCustomerAuth: (actionCallback: () => void, tab?: 'login' | 'register' | 'forgot') => void;
}
