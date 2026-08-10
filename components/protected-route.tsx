'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading, openAuthModal } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      if (pathname.startsWith('/admin')) {
        router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
      } else {
        openAuthModal('login', () => {
          // Action callback on modal login completion
        });
      }
    }
  }, [isLoading, isAuthenticated, router, pathname, openAuthModal]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] p-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative w-48 h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden shadow-inner">
            <div className="absolute inset-y-0 bg-gradient-to-r from-[#A50025] via-[#E66001] to-[#A50025] w-full rounded-full animate-progress-glow" />
          </div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-[#A50025]">Verifying Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-xl text-center border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
          <p className="text-sm text-slate-600 mb-6">
            You do not have permission to view this page. Required role: {allowedRoles.join(', ')}.
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded-xl bg-maroon px-5 py-2.5 text-sm font-semibold text-white hover:bg-maroon-dark transition shadow-xs"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
