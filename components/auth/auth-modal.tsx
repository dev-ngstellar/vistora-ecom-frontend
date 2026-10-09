'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { brandConfig } from '@/config';
import { AuthResponseData } from '@/types/auth.types';
import toast from 'react-hot-toast';
import { X, Lock, Mail, User, Phone, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  if (!isOpen) return null;

  const validateRegisterForm = (): Record<string, string> => {
    const errs: Record<string, string> = {};

    // 1. First Name
    const cleanFirst = regFirstName.trim();
    if (!cleanFirst) {
      errs.firstName = 'First name is required';
    } else if (/\d/.test(cleanFirst)) {
      errs.firstName = 'First name cannot contain numbers';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(cleanFirst)) {
      errs.firstName = 'First name must contain only letters';
    } else if (cleanFirst.length < 2) {
      errs.firstName = 'First name must be at least 2 characters';
    }

    // 2. Last Name
    const cleanLast = regLastName.trim();
    if (!cleanLast) {
      errs.lastName = 'Last name is required';
    } else if (/\d/.test(cleanLast)) {
      errs.lastName = 'Last name cannot contain numbers';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(cleanLast)) {
      errs.lastName = 'Last name must contain only letters';
    } else if (cleanLast.length < 2) {
      errs.lastName = 'Last name must be at least 2 characters';
    }

    // 3. Email
    const cleanEmail = regEmail.trim();
    if (!cleanEmail) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      errs.email = 'Please enter a valid email address';
    }

    // 4. Phone (Optional, but strictly 10 digits if provided)
    const cleanPhone = regPhone.replace(/[\s\-+]/g, '').replace(/^91/, '').trim();
    if (cleanPhone) {
      if (/[^\d]/.test(cleanPhone)) {
        errs.phone = 'Phone number cannot contain letters';
      } else if (cleanPhone.length !== 10) {
        errs.phone = 'Phone number must be exactly 10 digits';
      } else if (!/^[6-9]/.test(cleanPhone)) {
        errs.phone = 'Phone number must start with 6, 7, 8, or 9';
      }
    }

    // 5. Password
    if (!regPassword) {
      errs.password = 'Password is required';
    } else if (regPassword.length < 8) {
      errs.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^~_-])/.test(regPassword)) {
      errs.password = 'Include upper, lower, number, and special character';
    }

    return errs;
  };

  const validateLoginForm = (): Record<string, string> => {
    const errs: Record<string, string> = {};
    const cleanEmail = loginEmail.trim();
    if (!cleanEmail) {
      errs.loginEmail = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(cleanEmail)) {
      errs.loginEmail = 'Please enter a valid email address';
    }
    if (!loginPassword) {
      errs.loginPassword = 'Password is required';
    }
    return errs;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const errs = validateLoginForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const data = await authService.login({ email: loginEmail.trim(), password: loginPassword });
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

    const errs = validateRegisterForm();
    if (Object.keys(errs).length > 0) {
      setFieldErrors(errs);
      const firstError = Object.values(errs)[0];
      setErrorMessage(firstError);
      return;
    }
    setFieldErrors({});
    setIsLoading(true);

    try {
      const cleanPhone = regPhone.replace(/[\s\-+]/g, '').replace(/^91/, '').trim();
      const data = await authService.register({
        firstName: regFirstName.trim(),
        lastName: regLastName.trim(),
        email: regEmail.trim(),
        password: regPassword,
        confirmPassword: regPassword,
        phone: cleanPhone || undefined,
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
            <Image src={brandConfig.logoUrl} alt="Vistora" width={36} height={36} className="object-contain" />
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
                setFieldErrors({});
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
                setFieldErrors({});
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
          <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. LOGIN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} noValidate className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={loginEmail}
                  onChange={(e) => {
                    setLoginEmail(e.target.value);
                    if (fieldErrors.loginEmail) setFieldErrors((prev) => ({ ...prev, loginEmail: '' }));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.loginEmail
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-200 focus:ring-maroon'
                  }`}
                />
              </div>
              {fieldErrors.loginEmail && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.loginEmail}</span>
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 block">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('forgot');
                    setErrorMessage(null);
                    setFieldErrors({});
                  }}
                  className="text-[11px] font-extrabold text-maroon hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (fieldErrors.loginPassword) setFieldErrors((prev) => ({ ...prev, loginPassword: '' }));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.loginPassword
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-200 focus:ring-maroon'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldErrors.loginPassword && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.loginPassword}</span>
                </p>
              )}
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
          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="John"
                  value={regFirstName}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                    setRegFirstName(clean);
                    if (fieldErrors.firstName) setFieldErrors((prev) => ({ ...prev, firstName: '' }));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.firstName
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-200 focus:ring-maroon'
                  }`}
                />
                {fieldErrors.firstName && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.firstName}</span>
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Doe"
                  value={regLastName}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                    setRegLastName(clean);
                    if (fieldErrors.lastName) setFieldErrors((prev) => ({ ...prev, lastName: '' }));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full px-3 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.lastName
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-200 focus:ring-maroon'
                  }`}
                />
                {fieldErrors.lastName && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.lastName}</span>
                  </p>
                )}
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
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className={`w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                    fieldErrors.email
                      ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                      : 'border-slate-200 focus:ring-maroon'
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.email}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Phone (Optional)</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={regPhone}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
                      setRegPhone(clean);
                      if (fieldErrors.phone) setFieldErrors((prev) => ({ ...prev, phone: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className={`w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                      fieldErrors.phone
                        ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-200 focus:ring-maroon'
                    }`}
                  />
                </div>
                {fieldErrors.phone && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.phone}</span>
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Password *</label>
                <div className="relative flex items-center">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="Min 8 chars"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className={`w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border text-slate-900 focus:outline-none focus:ring-2 transition ${
                      fieldErrors.password
                        ? 'border-red-500 ring-1 ring-red-500 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-200 focus:ring-maroon'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    className="absolute right-2 p-1 text-slate-400 hover:text-slate-600 focus:outline-none transition"
                    aria-label={showRegPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>{fieldErrors.password}</span>
                  </p>
                )}
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
