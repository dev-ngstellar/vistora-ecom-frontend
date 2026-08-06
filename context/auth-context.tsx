'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { AuthContextType, AuthResponseData, User } from '@/types/auth.types';
import { AuthModal } from '@/components/auth/auth-modal';

import { getGuestCartFromStorage, saveGuestCartToStorage } from '@/hooks/use-shopping';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Auth Modal & Action-driven authentication states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'forgot'>('login');
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const router = useRouter();

  const syncGuestCart = async () => {
    const guestItems = getGuestCartFromStorage();
    if (guestItems.length > 0) {
      try {
        await authService.getCurrentUser(); // verify session
        const { cartService } = await import('@/services/shopping.service');
        await cartService.mergeGuestCart(
          guestItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
          }))
        );
        saveGuestCartToStorage([]);
      } catch {
        // Suppress guest cart merge error if any
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = (data: AuthResponseData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    }
    setUser(data.user);
    syncGuestCart();
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Suppress API logout errors
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : null));
  };

  const openAuthModal = (
    tab: 'login' | 'register' | 'forgot' = 'login',
    onSuccess?: () => void
  ) => {
    setAuthModalTab(tab);
    if (onSuccess) {
      setPendingAction(() => onSuccess);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const requireCustomerAuth = (
    actionCallback: () => void,
    tab: 'login' | 'register' | 'forgot' = 'login'
  ) => {
    if (user) {
      // Authenticated user: execute action immediately
      actionCallback();
    } else {
      // Guest user: open Auth Modal and save callback for execution on success
      openAuthModal(tab, actionCallback);
    }
  };

  const handleModalSuccess = (data: AuthResponseData) => {
    login(data);
    setIsAuthModalOpen(false);

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        login,
        logout,
        updateUser,
        openAuthModal,
        closeAuthModal,
        requireCustomerAuth,
      }}
    >
      {children}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={closeAuthModal}
        onSuccess={handleModalSuccess}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
