'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared';
import { useAuth } from '@/context/auth-context';
import { addressService } from '@/platform/checkout/services/address.service';
import { AddressResponse } from '@/platform/checkout/types/address.types';
import { INDIAN_STATES } from '@/platform/checkout/validators/address.validator';
import toast from 'react-hot-toast';
import {
  User,
  Mail,
  Shield,
  MapPin,
  Package,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  ShoppingBag,
  Heart,
  Loader2,
  Calendar,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useMyReviews, useDeleteMyReview } from '@/hooks/use-sales';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: myReviews = [], isLoading: loadingReviews } = useMyReviews();
  const deleteReviewMutation = useDeleteMyReview();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    phone: '',
    type: 'HOME' as 'HOME' | 'OFFICE' | 'OTHER',
    isDefault: false,
  });

  const validateAddressForm = (data: typeof formData) => {
    const errs: Record<string, string> = {};

    // 1. Full Name
    const trimmedName = data.fullName.trim();
    if (!trimmedName) {
      errs.fullName = 'Full name is required';
    } else if (/\d/.test(trimmedName)) {
      errs.fullName = 'Full name cannot contain numbers';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedName)) {
      errs.fullName = 'Full name must contain only letters and spaces';
    } else if (trimmedName.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters';
    }

    // 2. Phone Number (10 digits Indian mobile)
    const cleanPhone = data.phone.replace(/[\s\-+]/g, '').replace(/^91/, '');
    if (!cleanPhone) {
      errs.phone = 'Phone number is required';
    } else if (/[^\d]/.test(cleanPhone)) {
      errs.phone = 'Phone number cannot contain letters or symbols';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits';
    } else if (!/^[6-9]/.test(cleanPhone)) {
      errs.phone = 'Phone number must start with 6, 7, 8, or 9';
    }

    // 3. Address Line 1
    const trimmedAddr1 = data.addressLine1.trim();
    if (!trimmedAddr1) {
      errs.addressLine1 = 'Address line 1 is required';
    } else if (trimmedAddr1.length < 5) {
      errs.addressLine1 = 'Address line 1 must be at least 5 characters (e.g. Flat/Door No., Street)';
    }

    // 4. City
    const trimmedCity = data.city.trim();
    if (!trimmedCity) {
      errs.city = 'City is required';
    } else if (/\d/.test(trimmedCity)) {
      errs.city = 'City cannot contain numbers';
    } else if (!/^[a-zA-Z\s.'-]+$/.test(trimmedCity)) {
      errs.city = 'City must contain only letters';
    } else if (trimmedCity.length < 2) {
      errs.city = 'City must be at least 2 characters';
    }

    // 5. State
    const trimmedState = data.state.trim();
    if (!trimmedState) {
      errs.state = 'Please select or enter your State';
    } else if (trimmedState.length < 2) {
      errs.state = 'State must be at least 2 characters';
    }

    // 6. Postal Code (6 digits PIN)
    const cleanPin = data.postalCode.trim();
    if (!cleanPin) {
      errs.postalCode = 'Postal code / PIN is required';
    } else if (/[^\d]/.test(cleanPin)) {
      errs.postalCode = 'Postal code must contain numbers only (not text)';
    } else if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      errs.postalCode = 'PIN code must be a valid 6-digit number (e.g. 641012)';
    }

    return errs;
  };

  // 1. Fetch Saved Customer Addresses
  const { data: addresses = [], isLoading: loadingAddresses } = useQuery({
    queryKey: ['customer', 'addresses'],
    queryFn: () => addressService.listAddresses(),
    enabled: !!user,
  });

  // 2. Add Address Mutation
  const addAddressMutation = useMutation({
    mutationFn: (data: typeof formData) => addressService.createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
      toast.success('Address saved successfully');
      setShowAddModal(false);
      setFormErrors({});
      setFormData({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        type: 'HOME',
        isDefault: false,
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to save address. Please check required fields.';
      toast.error(msg);
    },
  });

  // 2b. Update Address Mutation
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: typeof formData }) =>
      addressService.updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
      toast.success('Address updated successfully');
      setShowAddModal(false);
      setEditingAddress(null);
      setFormErrors({});
      setFormData({
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
        phone: '',
        type: 'HOME',
        isDefault: false,
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || 'Failed to update address. Please check required fields.';
      toast.error(msg);
    },
  });

  // 3. Delete Address Mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (id: string) => addressService.deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });
      toast.success('Address removed');
    },
    onError: () => {
      toast.error('Failed to remove address');
    },
  });

  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setFormErrors({});
    setFormData({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      phone: '',
      type: 'HOME',
      isDefault: false,
    });
    setShowAddModal(true);
  };

  const handleOpenEditModal = (addr: AddressResponse) => {
    setEditingAddress(addr);
    setFormErrors({});
    setFormData({
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country,
      phone: addr.phone,
      type: addr.type,
      isDefault: addr.isDefault,
    });
    setShowAddModal(true);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateAddressForm(formData);
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      const firstError = Object.values(errs)[0];
      toast.error(firstError || 'Please correct the highlighted fields in the address form');
      return;
    }
    setFormErrors({});

    // Cleaned payload
    const payload = {
      ...formData,
      fullName: formData.fullName.trim(),
      phone: formData.phone.replace(/[\s\-+]/g, '').replace(/^91/, '').trim(),
      addressLine1: formData.addressLine1.trim(),
      addressLine2: formData.addressLine2?.trim() || null,
      city: formData.city.trim(),
      state: formData.state.trim(),
      postalCode: formData.postalCode.trim(),
      country: 'India',
    };

    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: payload as any });
    } else {
      addAddressMutation.mutate(payload as any);
    }
  };

  const userInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-8">
        {/* User Account Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-maroon/5 rounded-full blur-2xl -z-10" />

          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-maroon text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {userInitial}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                  {user?.firstName} {user?.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-maroon-light text-maroon border border-maroon/20">
                  {user?.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href="/orders"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-maroon text-white text-xs font-bold hover:bg-maroon-dark transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
            <Link
              href="/wishlist"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Heart className="w-4 h-4 text-maroon" />
              <span>Wishlist</span>
            </Link>
          </div>
        </div>

        {/* Account Details & Profile Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-maroon" />
              Account Details
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">Full Name</span>
                <span className="font-bold text-slate-800">{user?.firstName} {user?.lastName}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Email Address</span>
                <span className="font-bold text-slate-800">{user?.email}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Account Access Role</span>
                <span className="font-bold text-maroon uppercase">{user?.role}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">Account Security</span>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified Account
                </span>
              </div>
            </div>
          </div>

          {/* Address Book Section */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-maroon" />
                  Saved Shipping Addresses
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">Manage your saved addresses for fast 1-click checkout.</p>
              </div>

              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-2 rounded-xl bg-orange text-white text-xs font-bold hover:bg-orange-dark transition flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>

            {loadingAddresses ? (
              <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-maroon" />
                <span>Loading saved addresses...</span>
              </div>
            ) : addresses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition flex flex-col justify-between space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-slate-900">{addr.fullName}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase text-maroon bg-maroon-light px-2 py-0.5 rounded-full">
                          {addr.type}
                        </span>
                        <button
                          onClick={() => handleOpenEditModal(addr)}
                          className="text-slate-400 hover:text-maroon transition p-1"
                          title="Edit Address"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAddressMutation.mutate(addr.id)}
                          disabled={deleteAddressMutation.isPending}
                          className="text-slate-400 hover:text-red-600 transition p-1"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 && `, ${addr.addressLine2}`}
                      <br />
                      {addr.city}, {addr.state} {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>

                    <div className="text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-200/60">
                      Phone: {addr.phone}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 text-center space-y-3">
                <MapPin className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-600">No saved addresses found.</p>
                <p className="text-[11px] text-slate-400">Click "Add New" to save your shipping destination for faster checkout.</p>
              </div>
            )}
          </div>
        </div>

        {/* My Product Reviews Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                My Product Reviews ({myReviews.length})
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Ratings and feedback you have submitted across Vistora products.
              </p>
            </div>
          </div>

          {loadingReviews ? (
            <div className="p-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-maroon" /> Loading reviews...
            </div>
          ) : myReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={rev.product?.slug ? `/product/${rev.product.slug}` : '#'}
                        className="text-xs font-black text-slate-900 hover:text-maroon line-clamp-1 transition"
                      >
                        {rev.product?.name || 'Vistora Harvest'}
                      </Link>

                      <div className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {rev.title && (
                      <p className="text-xs font-extrabold text-slate-800 tracking-tight">
                        {rev.title}
                      </p>
                    )}

                    {rev.comment && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                        {rev.comment}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 text-[10px]">
                    <span className="text-slate-400 font-medium">
                      {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this review?')) {
                          deleteReviewMutation.mutate(rev.id);
                        }
                      }}
                      className="text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-slate-50 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-slate-600">No reviews submitted yet.</p>
              <p className="text-[11px] text-slate-400">
                You can write a review directly on any product page you've tasted!
              </p>
            </div>
          )}
        </div>

        {/* Modal: Add New Address */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-maroon" />
                  {editingAddress ? 'Edit Shipping Address' : 'Add New Shipping Address'}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} noValidate className="space-y-4 text-xs">
                {/* Full Name & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                        setFormData({ ...formData, fullName: val });
                        if (formErrors.fullName) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.fullName;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 transition focus:outline-none ${
                        formErrors.fullName
                          ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                      }`}
                    />
                    {formErrors.fullName && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        ⚠ {formErrors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Phone Number (10 Digits) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 font-bold text-slate-400 select-none">+91</span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: digits });
                          if (formErrors.phone) {
                            setFormErrors((prev) => {
                              const updated = { ...prev };
                              delete updated.phone;
                              return updated;
                            });
                          }
                        }}
                        className={`w-full pl-11 pr-3.5 py-2.5 rounded-xl border text-slate-900 transition font-mono tracking-wide focus:outline-none ${
                          formErrors.phone
                            ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                            : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        ⚠ {formErrors.phone}
                      </p>
                    )}
                  </div>
                </div>

                {/* Address Line 1 */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Address Line 1 (Flat/Door No., Building, Street) *</label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 402, Royal Residency, 5th Cross Street"
                    value={formData.addressLine1}
                    onChange={(e) => {
                      setFormData({ ...formData, addressLine1: e.target.value });
                      if (formErrors.addressLine1) {
                        setFormErrors((prev) => {
                          const updated = { ...prev };
                          delete updated.addressLine1;
                          return updated;
                        });
                      }
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 transition focus:outline-none ${
                      formErrors.addressLine1
                        ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                        : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                    }`}
                  />
                  {formErrors.addressLine1 && (
                    <p className="text-[11px] font-bold text-rose-600 mt-1">
                      ⚠ {formErrors.addressLine1}
                    </p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Address Line 2 (Locality, Landmark - Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Near Gandhipuram Bus Stand"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>

                {/* City, State, Postal Code */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">City *</label>
                    <input
                      type="text"
                      placeholder="e.g. Coimbatore"
                      value={formData.city}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^a-zA-Z\s.'-]/g, '');
                        setFormData({ ...formData, city: val });
                        if (formErrors.city) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.city;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 transition focus:outline-none ${
                        formErrors.city
                          ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                      }`}
                    />
                    {formErrors.city && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        ⚠ {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">State *</label>
                    <select
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ ...formData, state: e.target.value });
                        if (formErrors.state) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.state;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full px-3 py-2.5 rounded-xl border text-slate-900 font-medium transition focus:outline-none ${
                        formErrors.state
                          ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                      }`}
                    >
                      <option value="">Select State</option>
                      {INDIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {formErrors.state && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        ⚠ {formErrors.state}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">PIN Code (6 Digits) *</label>
                    <input
                      type="text"
                      maxLength={6}
                      placeholder="e.g. 641012"
                      value={formData.postalCode}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setFormData({ ...formData, postalCode: digits });
                        if (formErrors.postalCode) {
                          setFormErrors((prev) => {
                            const updated = { ...prev };
                            delete updated.postalCode;
                            return updated;
                          });
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-slate-900 font-mono tracking-wider transition focus:outline-none ${
                        formErrors.postalCode
                          ? 'bg-rose-50/30 border-rose-400 focus:ring-2 focus:ring-rose-500'
                          : 'bg-slate-50 border-slate-200 focus:ring-2 focus:ring-maroon'
                      }`}
                    />
                    {formErrors.postalCode && (
                      <p className="text-[11px] font-bold text-rose-600 mt-1">
                        ⚠ {formErrors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                {/* Country & Address Tag */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Country</label>
                    <input
                      type="text"
                      disabled
                      value="India"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 cursor-not-allowed font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Address Tag</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon font-semibold"
                    >
                      <option value="HOME">HOME</option>
                      <option value="OFFICE">OFFICE</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormErrors({});
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                    className="px-5 py-2.5 rounded-xl bg-maroon text-white font-bold hover:bg-maroon-dark transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {(addAddressMutation.isPending || updateAddressMutation.isPending) && (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    )}
                    <span>{editingAddress ? 'Update Address' : 'Save Address'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
