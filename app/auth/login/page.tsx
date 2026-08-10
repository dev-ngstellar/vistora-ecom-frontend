'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/auth-context';
import { LoginInput, loginSchema } from '@/lib/validations/auth.validation';
import { authService } from '@/services/auth.service';
import { ApiEnvelope } from '@/types/auth.types';
import { brandConfig } from '@/config';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (data) => {
      login(data);
      toast.success('Welcome back to Vistora Commerce!');
      router.push(redirectUrl);
    },
    onError: (error: AxiosError<ApiEnvelope>) => {
      const errorMessage =
        error.response?.data?.message || 'Failed to authenticate. Please check your credentials.';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-3xl bg-white p-8 sm:p-10 border border-[#E5E7EB] shadow-xl">
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <img
              src={brandConfig.logoUrl}
              alt={brandConfig.name}
              className="h-12 w-auto mx-auto object-contain"
            />
          </Link>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Welcome Back
          </h2>
          <p className="text-xs text-[#64748B] font-medium">
            Sign in to access your Vistora Commerce account
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#111827] mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="name@example.com"
                  className={`block w-full rounded-xl border pl-10 pr-4 py-2.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-[#E5E7EB] focus:border-[#A50025] focus:ring-[#A50025]/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#111827]">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-extrabold text-[#A50025] hover:text-[#E66001] transition"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`block w-full rounded-xl border pl-10 pr-10 py-2.5 text-xs text-[#111827] placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? 'border-rose-500 focus:ring-rose-500/20'
                      : 'border-[#E5E7EB] focus:border-[#A50025] focus:ring-[#A50025]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative flex w-full justify-center rounded-xl bg-[#A50025] hover:bg-[#7D001C] py-3 px-4 text-xs font-black uppercase tracking-wider text-white shadow-md hover:scale-[1.01] disabled:opacity-70 transition duration-150"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          <div className="text-center text-xs text-[#64748B] font-medium pt-2">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-extrabold text-[#A50025] hover:text-[#E66001] transition"
            >
              Create Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
