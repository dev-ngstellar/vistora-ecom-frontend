'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared';
import { useAuth } from '@/context/auth-context';
import { addressService } from '@/platform/checkout/services/address.service';
import { AddressResponse } from '@/platform/checkout/types/address.types';
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
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);
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
    onError: () => {
      toast.error('Failed to save address. Please check required fields.');
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
    onError: () => {
      toast.error('Failed to update address. Please check required fields.');
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
    if (!formData.fullName || !formData.addressLine1 || !formData.city || !formData.postalCode || !formData.phone) {
      toast.error('Please fill in all required address fields');
      return;
    }
    if (editingAddress) {
      updateAddressMutation.mutate({ id: editingAddress.id, data: formData });
    } else {
      addAddressMutation.mutate(formData);
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

              <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Address Line 1 *</label>
                  <input
                    type="text"
                    required
                    placeholder="House/Flat No., Building Name, Street"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Address Line 2 (Optional)</label>
                  <input
                    type="text"
                    placeholder="Locality, Landmark"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">State *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Postal Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 400001"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Country</label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">Address Tag</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon font-semibold"
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
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addAddressMutation.isPending || updateAddressMutation.isPending}
                    className="px-5 py-2 rounded-xl bg-maroon text-white font-bold hover:bg-maroon-dark transition shadow-xs flex items-center gap-1.5"
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
