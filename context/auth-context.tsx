'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { authService } from '@/services/auth.service';
import { AuthContextType, AuthResponseData, User } from '@/types/auth.types';
import { AuthModal } from '@/components/auth/auth-modal';

import { getGuestCartFromStorage, saveGuestCartToStorage } from '@/hooks/use-shopping';
import { queryClient } from '@/lib/react-query';

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
      saveGuestCartToStorage([]); // Clear immediately to prevent duplicate concurrent merge calls
      try {
        const { cartService } = await import('@/services/shopping.service');
        await cartService.mergeGuestCart(
          guestItems.map((i) => ({
            productId: i.productId,
            variantId: i.variantId || null,
            quantity: i.quantity,
          }))
        );
      } catch (err) {
        console.error('Failed to sync guest cart on login:', err);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? sessionStorage.getItem('accessToken') : null;
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          await syncGuestCart();
          setUser(currentUser);
        } catch {
          sessionStorage.removeItem('accessToken');
          sessionStorage.removeItem('refreshToken');
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = React.useCallback(async (data: AuthResponseData) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
    }
    await syncGuestCart();
    setUser(data.user);
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['wishlist'] });
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Suppress API logout errors
    } finally {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('refreshToken');
      }
      setUser(null);
      queryClient.clear();
      toast.success('Logged out successfully');
      router.push('/');
    }
  }, [router]);

  const updateUser = React.useCallback((updatedFields: Partial<User>) => {
    setUser((prevUser) => (prevUser ? { ...prevUser, ...updatedFields } : null));
  }, []);

  const openAuthModal = React.useCallback(
    (tab: 'login' | 'register' | 'forgot' = 'login', onSuccess?: () => void) => {
      setAuthModalTab(tab);
      if (onSuccess) {
        setPendingAction(() => onSuccess);
      } else {
        setPendingAction(null);
      }
      setIsAuthModalOpen(true);
    },
    []
  );

  const closeAuthModal = React.useCallback(() => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  }, []);

  const requireCustomerAuth = React.useCallback(
    (actionCallback: () => void, tab: 'login' | 'register' | 'forgot' = 'login') => {
      if (user) {
        // Authenticated user: execute action immediately
        actionCallback();
      } else {
        // Guest user: open Auth Modal and save callback for execution on success
        openAuthModal(tab, actionCallback);
      }
    },
    [user, openAuthModal]
  );

  const handleModalSuccess = React.useCallback(
    async (data: AuthResponseData) => {
      await login(data);
      setIsAuthModalOpen(false);

      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    },
    [login, pendingAction]
  );

  const contextValue = React.useMemo<AuthContextType>(
    () => ({
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
    }),
    [
      user,
      isLoading,
      isAuthModalOpen,
      authModalTab,
      login,
      logout,
      updateUser,
      openAuthModal,
      closeAuthModal,
      requireCustomerAuth,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
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
