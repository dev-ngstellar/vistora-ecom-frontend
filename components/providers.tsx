'use client';

import React from 'react';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/auth-context';
import { queryClient } from '@/lib/react-query';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AntdRegistry>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#f8fafc',
                borderRadius: '12px',
                fontSize: '14px',
              },
            }}
          />
        </AuthProvider>
      </QueryClientProvider>
    </AntdRegistry>
  );
};
