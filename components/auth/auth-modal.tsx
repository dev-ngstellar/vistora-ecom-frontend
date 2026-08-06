'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { AuthResponseData } from '@/types/auth.types';
import toast from 'react-hot-toast';
import { X, Lock, Mail, User, Phone, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register' | 'forgot';
  onClose: () => void;
  onSuccess: (data: AuthResponseData) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'forgot'>(initialTab);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await authService.login({ email: loginEmail, password: loginPassword });
      toast.success(`Welcome back, ${data.user.firstName}!`);
      onSuccess(data);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Invalid email or password';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const data = await authService.register({
        firstName: regFirstName,
        lastName: regLastName,
        email: regEmail,
        password: regPassword,
        confirmPassword: regPassword,
        phone: regPhone || undefined,
      });
      toast.success('Account created successfully!');
      onSuccess(data);
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to create account. Please check inputs.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email: forgotEmail });
      setForgotSent(true);
      toast.success('Password reset instructions sent');
    } catch (err: any) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Failed to request password reset';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="Vistora" width={36} height={36} className="object-contain" />
            <span className="text-xl font-black text-maroon tracking-tight">VISTORA</span>
          </div>
          <p className="text-xs text-slate-500 font-medium">One Destination. Endless Choices...</p>
        </div>

        {/* Tab Navigation */}
        {activeTab !== 'forgot' && (
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition ${
                activeTab === 'login'
                  ? 'bg-maroon text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
              }}
              className={`py-2 rounded-xl transition ${
                activeTab === 'register'
                  ? 'bg-maroon text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold">
            {errorMessage}
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setErrorMessage(null);
                  }}
                  className="text-[11px] font-extrabold text-maroon hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-maroon hover:bg-maroon-dark text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Log In to Continue</span>}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Demo Credentials: <span className="font-bold text-slate-800">customer@example.com</span> / <span className="font-bold text-slate-800">Password123!</span>
            </div>
          </form>
        )}

        {/* 2. REGISTER FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={regFirstName}
                  onChange={(e) => setRegFirstName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Email Address *</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Phone (Optional)</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 chars"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-maroon hover:bg-maroon-dark text-white font-extrabold text-xs transition shadow-md flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Account & Continue</span>}
            </button>
          </form>
        )}

        {/* 3. FORGOT PASSWORD FORM */}
        {activeTab === 'forgot' && (
          <div className="space-y-3.5 text-xs">
            <h3 className="text-sm font-extrabold text-slate-900">Reset Password</h3>

            {forgotSent ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-emerald-900">Instructions Sent!</p>
                <p className="text-[11px] text-emerald-700">Check your inbox for password reset instructions.</p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setForgotSent(false);
                  }}
                  className="mt-2 text-xs font-bold text-maroon hover:underline"
                >
                  Return to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-slate-500 font-bold hover:underline"
                  >
                    Back to Log In
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 rounded-xl bg-maroon text-white font-bold hover:bg-maroon-dark transition shadow-xs flex items-center gap-1.5"
                  >
                    {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    <span>Send Reset Email</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
