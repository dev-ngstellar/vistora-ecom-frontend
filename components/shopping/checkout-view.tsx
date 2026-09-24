'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  useCheckout,
  useAddresses,
  useShipping,
  useCoupons,
  usePayment,
  useOrderSummary,
  CheckoutStep,
  checkoutService,
} from '@/platform/checkout';
import toast from 'react-hot-toast';
import { brandConfig } from '@/config';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Plus,
  Pencil,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Tag,
  Sparkles,
  Lock,
  ShoppingBag,
  RotateCcw,
  Check,
  Phone,
  Building2,
  Home,
  FileText,
  AlertCircle,
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    currentStep,
    selectedAddressId,
    setSelectedAddressId,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    notes,
    setNotes,
    user,
    cartSummary,
    hasItemsInCart,
    isLoading,
    isAuthLoading,
    isCartLoading,
    goToStep,
    nextStep,
    prevStep,
    submitOrder,
    isSubmittingOrder,
    createdOrderId,
  } = useCheckout();

  const {
    addresses,
    isLoading: loadingAddresses,
    createAddress,
    isCreating,
    updateAddress,
    isUpdating,
  } = useAddresses();

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const { methods: shippingMethods, selectedMethod, setSelectedMethodId, shippingCost } = useShipping(
    cartSummary?.subtotal || 0,
    selectedAddress,
  );

  const { couponCode, coupon, discountAmount, applyCoupon, removeCoupon, isApplying, isRemoving } = useCoupons();
  const [couponInput, setCouponInput] = useState('');
  const [isItemsExpanded, setIsItemsExpanded] = useState(true);

  const { selectedGateway, setSelectedGateway, processPayment, isProcessing, paymentError } = usePayment();

  const summary = useOrderSummary(shippingCost);

  // Address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    type: 'HOME' as 'HOME' | 'OFFICE' | 'OTHER',
    isDefault: true,
  });

  const handleEditAddress = (addr: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddressId(addr.id);
    setNewAddr({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || 'India',
      type: addr.type || 'HOME',
      isDefault: addr.isDefault ?? true,
    });
    setShowAddressForm(true);
  };

  const handleAddNewClick = () => {
    setEditingAddressId(null);
    setNewAddr({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      type: 'HOME',
      isDefault: true,
    });
    setShowAddressForm(!showAddressForm || editingAddressId !== null);
  };

  const handleAddAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      await updateAddress({ id: editingAddressId, data: newAddr });
      setEditingAddressId(null);
    } else {
      await createAddress(newAddr);
    }
    setShowAddressForm(false);
  };

  const handleFinalOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address first');
      goToStep(CheckoutStep.SHIPPING_ADDRESS);
      return;
    }

    if (selectedPaymentMethod === 'RAZORPAY') {
      // Execute Razorpay Test flow
      const res = await processPayment({
        orderPayload: {
          addressId: selectedAddressId,
          couponCode: cartSummary?.couponCode || null,
          notes: notes || undefined,
        },
        userEmail: user?.email,
        userName: user?.fullName || selectedAddress?.fullName,
        userPhone: selectedAddress?.phone || user?.phone,
      });

      if (res.success && res.orderId) {
        toast.success('Payment verified! Order confirmed.');
        submitOrder({
          addressId: selectedAddressId,
          paymentMethod: 'RAZORPAY',
          notes,
        });
      }
    } else {
      // Execute COD Flow
      submitOrder({
        addressId: selectedAddressId,
        paymentMethod: 'COD',
        notes,
      });
    }
  };

  // ==================== STEP 5: CONFIRMATION VIEW ====================
  if (currentStep === CheckoutStep.CONFIRMATION && createdOrderId) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 text-center space-y-8 animate-fade-in">
        <div className="relative mx-auto w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-600/10 ring-8 ring-emerald-500/10">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <Check className="w-3.5 h-3.5" />
            Order Confirmed & Placed
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Thank You For Your Order!</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your order reference is <span className="font-mono font-bold text-slate-900">#{createdOrderId.slice(-8).toUpperCase()}</span>. A confirmation notification has been dispatched to <strong className="text-slate-900">{user?.email}</strong>.
          </p>
        </div>

        <div className="p-6 bg-slate-50/80 rounded-3xl border border-slate-200/80 text-left space-y-4 max-w-lg mx-auto text-xs text-slate-600 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-slate-500 font-medium">Customer Email</span>
            <span className="font-bold text-slate-900">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-slate-500 font-medium">Payment Mode</span>
            <span className="inline-flex items-center gap-1 font-bold text-slate-900">
              {selectedPaymentMethod === 'RAZORPAY' ? 'Razorpay Online (Verified)' : 'Cash on Delivery (COD)'}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
            <span className="text-slate-500 font-medium">Delivery Destination</span>
            <span className="font-bold text-slate-900 text-right truncate max-w-[240px]">
              {selectedAddress ? `${selectedAddress.city}, ${selectedAddress.state}` : 'Default Address'}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm font-bold text-slate-900">Total Payable</span>
            <span className="text-base font-black text-indigo-600">
              {brandConfig.currency.symbol}{summary.grandTotal.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/orders"
            className="px-6 py-3.5 rounded-2xl bg-[#A50025] hover:bg-[#80001D] text-white font-bold text-xs transition shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Track Order Status</span>
          </Link>
          <button
            onClick={async () => {
              try {
                toast.loading('Generating invoice...', { id: 'inv' });
                await checkoutService.downloadInvoice(createdOrderId);
                toast.success('Invoice receipt ready!', { id: 'inv' });
              } catch {
                toast.error('Invoice currently generating, please check orders history', { id: 'inv' });
              }
            }}
            className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Download Invoice</span>
          </button>
          <Link
            href="/shop"
            className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  // ==================== LOADING STATE ====================
  if (isLoading || isAuthLoading || isCartLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-64" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-100 rounded-3xl" />
          <div className="h-96 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );
  }

  // ==================== EMPTY CART STATE ====================
  if (!hasItemsInCart && currentStep !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-5">
        <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-3xl flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">Your Shopping Cart is Empty</h2>
          <p className="text-xs text-slate-500">Please add items to your cart before proceeding to checkout.</p>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#A50025] text-white font-bold text-xs hover:bg-[#80001D] transition shadow-md"
        >
          <span>Explore Catalog</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-widest text-[#A50025]">Express Checkout</span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Complete Your Order
          </h1>
        </div>
        <Link
          href="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#A50025] transition self-start sm:self-auto bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Cart</span>
        </Link>
      </div>

      {/* Modern Connected Step Progress Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {/* Step 1 Tab */}
          <button
            onClick={() => goToStep(CheckoutStep.SHIPPING_ADDRESS)}
            className={`flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-3 rounded-xl transition cursor-pointer text-left ${
              currentStep === CheckoutStep.SHIPPING_ADDRESS
                ? 'bg-[#A50025] text-white shadow-xs font-bold'
                : selectedAddressId
                  ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                currentStep === CheckoutStep.SHIPPING_ADDRESS
                  ? 'bg-white text-[#A50025] font-black'
                  : selectedAddressId
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
              }`}
            >
              {selectedAddressId && currentStep > CheckoutStep.SHIPPING_ADDRESS ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                '1'
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs leading-none">Delivery Address</div>
              <div className="text-[10px] opacity-75 mt-0.5">
                {selectedAddress ? `${selectedAddress.city}` : 'Choose location'}
              </div>
            </div>
          </button>

          {/* Step 2 Tab */}
          <button
            onClick={() => {
              if (selectedAddressId) goToStep(CheckoutStep.SHIPPING_METHOD);
            }}
            disabled={!selectedAddressId}
            className={`flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-3 rounded-xl transition cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50 ${
              currentStep === CheckoutStep.SHIPPING_METHOD
                ? 'bg-[#A50025] text-white shadow-xs font-bold'
                : currentStep > CheckoutStep.SHIPPING_METHOD
                  ? 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-semibold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                currentStep === CheckoutStep.SHIPPING_METHOD
                  ? 'bg-white text-[#A50025] font-black'
                  : currentStep > CheckoutStep.SHIPPING_METHOD
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-700'
              }`}
            >
              {currentStep > CheckoutStep.SHIPPING_METHOD ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                '2'
              )}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs leading-none">Shipping Speed</div>
              <div className="text-[10px] opacity-75 mt-0.5">
                {selectedMethod ? selectedMethod.name : 'Standard delivery'}
              </div>
            </div>
          </button>

          {/* Step 3 Tab */}
          <button
            onClick={() => {
              if (selectedAddressId) goToStep(CheckoutStep.PAYMENT_METHOD);
            }}
            disabled={!selectedAddressId}
            className={`flex items-center justify-center sm:justify-start gap-2.5 p-2.5 sm:px-4 sm:py-3 rounded-xl transition cursor-pointer text-left disabled:cursor-not-allowed disabled:opacity-50 ${
              currentStep === CheckoutStep.PAYMENT_METHOD
                ? 'bg-[#A50025] text-white shadow-xs font-bold'
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                currentStep === CheckoutStep.PAYMENT_METHOD
                  ? 'bg-white text-[#A50025] font-black'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              3
            </div>
            <div className="hidden sm:block">
              <div className="text-xs leading-none">Payment & Review</div>
              <div className="text-[10px] opacity-75 mt-0.5">Razorpay / COD</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main Checkout Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Columns: Dynamic Step Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* ============================================================
              STEP 1: SHIPPING ADDRESS
          ============================================================ */}
          {currentStep === CheckoutStep.SHIPPING_ADDRESS && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="space-y-0.5">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#A50025]" />
                    <span>Select Delivery Address</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Where would you like us to deliver your order?
                  </p>
                </div>
                <button
                  onClick={handleAddNewClick}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-[#A50025] text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New</span>
                </button>
              </div>

              {/* Address List Grid */}
              {loadingAddresses ? (
                <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-[#A50025]" />
                  <span>Loading your delivery addresses...</span>
                </div>
              ) : addresses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3.5 ${
                          isSelected
                            ? 'border-[#A50025] bg-[#A50025]/5 shadow-xs ring-4 ring-[#A50025]/10'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Radio Checkmark Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                                isSelected
                                  ? 'border-[#A50025] bg-[#A50025] text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                              {addr.fullName}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-black uppercase text-[#A50025] bg-[#A50025]/10 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              {addr.type === 'OFFICE' ? <Building2 className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                              {addr.type || 'HOME'}
                            </span>
                            <button
                              onClick={(e) => handleEditAddress(addr, e)}
                              className="p-1.5 text-slate-400 hover:text-[#A50025] hover:bg-white rounded-lg transition"
                              title="Edit Address"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Address Details */}
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          <br />
                          {addr.city}, {addr.state} - <strong>{addr.postalCode}</strong>
                          <br />
                          <span className="text-[11px] text-slate-500">{addr.country || 'India'}</span>
                        </p>

                        <div className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>Phone: {addr.phone}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 space-y-3 border border-dashed border-slate-300">
                  <MapPin className="w-8 h-8 text-slate-400 mx-auto" />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">No saved delivery address found</p>
                    <p className="text-slate-500 mt-0.5">Please add a shipping address to proceed with checkout.</p>
                  </div>
                  <button
                    onClick={handleAddNewClick}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#A50025] text-white font-bold text-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Address</span>
                  </button>
                </div>
              )}

              {/* Add / Edit Address Form Modal */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddressSubmit}
                  className="p-5 sm:p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs animate-fade-in"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#A50025]" />
                      <span>{editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}</span>
                    </h3>
                    <span className="text-[11px] text-slate-400">All fields required</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. John Doe"
                        required
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Phone Number (10 digits)</label>
                      <input
                        type="tel"
                        placeholder="+91 9876543210"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Street Address Line 1</label>
                      <input
                        type="text"
                        placeholder="House / Flat No., Building Name, Street"
                        required
                        value={newAddr.addressLine1}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">City / Town</label>
                      <input
                        type="text"
                        placeholder="e.g. Mumbai, Bengaluru"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        placeholder="e.g. Maharashtra, Karnataka"
                        required
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">PIN / Postal Code</label>
                      <input
                        type="text"
                        placeholder="e.g. 560001"
                        required
                        value={newAddr.postalCode}
                        onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">Address Type</label>
                      <select
                        value={newAddr.type}
                        onChange={(e) => setNewAddr({ ...newAddr, type: e.target.value as any })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium focus:ring-2 focus:ring-[#A50025] focus:outline-none"
                      >
                        <option value="HOME">Home (All-day delivery)</option>
                        <option value="OFFICE">Office (10 AM - 6 PM)</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreating || isUpdating}
                      className="px-5 py-2.5 rounded-xl bg-[#A50025] hover:bg-[#80001D] text-white font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                      {isCreating || isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      <span>{editingAddressId ? 'Save Changes' : 'Save Address'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Continue to Step 2 Button */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500">
                  {selectedAddress ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Address selected
                    </span>
                  ) : (
                    'Please choose a delivery address'
                  )}
                </div>
                <button
                  onClick={nextStep}
                  disabled={!selectedAddressId}
                  className="px-7 py-3.5 rounded-2xl bg-[#A50025] hover:bg-[#80001D] disabled:opacity-50 text-white font-black text-xs transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Continue to Shipping Method</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2: SHIPPING METHOD
          ============================================================ */}
          {currentStep === CheckoutStep.SHIPPING_METHOD && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              {/* Selected Address Summary Card */}
              {selectedAddress && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">
                        Delivering to: <span className="font-black">{selectedAddress.fullName}</span> ({selectedAddress.type})
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">
                        {selectedAddress.addressLine1}, {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.postalCode}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => goToStep(CheckoutStep.SHIPPING_ADDRESS)}
                    className="text-xs font-bold text-[#A50025] hover:underline cursor-pointer px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="space-y-0.5 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-[#A50025]" />
                  <span>Choose Delivery Speed</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Select your preferred shipping carrier tier for this order.
                </p>
              </div>

              {/* Shipping Method Cards */}
              <div className="space-y-3.5">
                {shippingMethods.map((m) => {
                  const isSelected = selectedMethod?.id === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethodId(m.id)}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#A50025] bg-[#A50025]/5 shadow-xs ring-4 ring-[#A50025]/10'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition ${
                            isSelected
                              ? 'border-[#A50025] bg-[#A50025] text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                            <span>{m.name}</span>
                            {m.isFree && (
                              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                Free Shipping Eligible
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {m.description} • Est. Arrival: <strong className="text-slate-700">{m.estimatedDays}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-slate-900">
                          {m.isFree ? (
                            <span className="text-emerald-700 font-extrabold">FREE</span>
                          ) : (
                            `${brandConfig.currency.symbol}${m.cost.toFixed(2)}`
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Navigation Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={prevStep}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>
                <button
                  onClick={nextStep}
                  className="px-7 py-3.5 rounded-2xl bg-[#A50025] hover:bg-[#80001D] text-white font-black text-xs transition shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <span>Continue to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3: PAYMENT METHOD & REVIEW
          ============================================================ */}
          {currentStep === CheckoutStep.PAYMENT_METHOD && (
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
              {/* Summaries of Previous Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedAddress && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">1. Delivery To:</div>
                      <div className="text-slate-600 truncate max-w-[180px] font-medium">
                        {selectedAddress.fullName}, {selectedAddress.city}
                      </div>
                    </div>
                    <button
                      onClick={() => goToStep(CheckoutStep.SHIPPING_ADDRESS)}
                      className="text-[11px] font-bold text-[#A50025] hover:underline"
                    >
                      Change
                    </button>
                  </div>
                )}
                {selectedMethod && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-[11px]">2. Shipping Method:</div>
                      <div className="text-slate-600 font-medium">
                        {selectedMethod.name} ({selectedMethod.isFree ? 'FREE' : `${brandConfig.currency.symbol}${selectedMethod.cost}`})
                      </div>
                    </div>
                    <button
                      onClick={() => goToStep(CheckoutStep.SHIPPING_METHOD)}
                      className="text-[11px] font-bold text-[#A50025] hover:underline"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-0.5 border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#A50025]" />
                  <span>Select Payment Method</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Choose how you would like to securely pay for this order.
                </p>
              </div>

              {/* Error Alert Banner if payment failed/cancelled */}
              {paymentError && (
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5 animate-fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Payment Notification</div>
                    <div className="text-slate-600 mt-0.5">{paymentError}</div>
                  </div>
                </div>
              )}

              {/* Payment Methods Selection */}
              <div className="space-y-3.5">
                {/* 1. Razorpay Option (Recommended) */}
                <div
                  onClick={() => {
                    setSelectedPaymentMethod('RAZORPAY');
                    setSelectedGateway('RAZORPAY');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'RAZORPAY'
                      ? 'border-[#A50025] bg-[#A50025]/5 shadow-xs ring-4 ring-[#A50025]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 mt-0.5 transition ${
                          selectedPaymentMethod === 'RAZORPAY'
                            ? 'border-[#A50025] bg-[#A50025] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedPaymentMethod === 'RAZORPAY' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-black text-slate-900">
                            Online Payment (UPI, Cards, NetBanking, Wallets)
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white uppercase tracking-wider">
                            Recommended
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase">
                            Razorpay Test Mode
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Pay instantly and securely via Google Pay, PhonePe, Paytm, Debit/Credit Cards, or NetBanking.
                        </p>
                        <div className="pt-2 flex items-center gap-2 flex-wrap text-[11px] font-bold text-slate-500">
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">UPI / QR</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">Credit / Debit Cards</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">NetBanking</span>
                          <span className="px-2 py-0.5 bg-slate-100 rounded-md border border-slate-200">Wallets</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Cash on Delivery (COD) Option */}
                <div
                  onClick={() => {
                    setSelectedPaymentMethod('COD');
                    setSelectedGateway('COD');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedPaymentMethod === 'COD'
                      ? 'border-[#A50025] bg-[#A50025]/5 shadow-xs ring-4 ring-[#A50025]/10'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border-2 mt-0.5 transition ${
                          selectedPaymentMethod === 'COD'
                            ? 'border-[#A50025] bg-[#A50025] text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selectedPaymentMethod === 'COD' && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">Cash on Delivery (COD)</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 uppercase">
                            Pay at Doorstep
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 font-medium">
                          Pay cash directly to the delivery executive when your order arrives.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Instructions / Notes Input */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Order Notes / Delivery Instructions (Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Leave package with security gate, call before delivery..."
                  className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#A50025] focus:bg-white transition"
                />
              </div>

              {/* Step Navigation & Submit Action */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={prevStep}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Shipping</span>
                </button>

                <button
                  onClick={handleFinalOrder}
                  disabled={isSubmittingOrder || isProcessing}
                  className={`px-8 py-4 rounded-2xl text-white font-black text-xs transition shadow-lg flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
                    selectedPaymentMethod === 'RAZORPAY'
                      ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800'
                  }`}
                >
                  {isSubmittingOrder || isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                  <span>
                    {selectedPaymentMethod === 'RAZORPAY'
                      ? `Pay ${brandConfig.currency.symbol}${summary.grandTotal.toFixed(2)} with Razorpay`
                      : `Place Order via COD (${brandConfig.currency.symbol}${summary.grandTotal.toFixed(2)})`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================
            RIGHT COLUMN: STICKY ORDER SUMMARY & ITEMS PREVIEW
        ============================================================ */}
        <div className="space-y-5 lg:sticky lg:top-24">
          {/* Coupon Code Block */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-slate-900">
                <Tag className="w-4 h-4 text-[#E66001]" />
                <span>Promo Code & Coupons</span>
              </div>
              {couponCode && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Applied
                </span>
              )}
            </div>

            {couponCode ? (
              <div className="p-3.5 bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/90 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono font-black text-xs text-emerald-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs tracking-wide shrink-0">
                      {couponCode}
                    </span>
                    {coupon?.title && coupon.title !== couponCode && (
                      <span className="text-xs font-bold text-emerald-900 truncate">
                        {coupon.title}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeCoupon()}
                    disabled={isRemoving}
                    className="text-rose-600 hover:text-rose-700 text-xs font-black hover:underline cursor-pointer transition shrink-0"
                  >
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </button>
                </div>

                {discountAmount > 0 ? (
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 pt-1 border-t border-emerald-200/60">
                    <Sparkles className="w-3.5 h-3.5 text-[#E66001] fill-[#E66001] shrink-0" />
                    <span>
                      Saved: <strong className="text-emerald-950">{brandConfig.currency.symbol}{discountAmount.toFixed(2)}</strong> on this order!
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ENTER COUPON CODE"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && couponInput.trim()) {
                      e.preventDefault();
                      applyCoupon(couponInput.trim());
                      setCouponInput('');
                    }
                  }}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs uppercase font-mono font-bold tracking-wider placeholder:font-sans placeholder:normal-case placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#A50025] focus:bg-white transition"
                />
                <button
                  onClick={() => {
                    if (couponInput.trim()) {
                      applyCoupon(couponInput.trim());
                      setCouponInput('');
                    }
                  }}
                  disabled={isApplying || !couponInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-[#A50025] text-white text-xs font-black uppercase tracking-wider hover:bg-[#80001D] disabled:opacity-50 transition shadow-xs flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  {isApplying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Collapsible Order Items Preview Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <button
              onClick={() => setIsItemsExpanded(!isItemsExpanded)}
              className="w-full p-4.5 px-5 flex items-center justify-between text-left text-xs font-black text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#A50025]" />
                <span>Items in Your Order ({summary.itemCount})</span>
              </div>
              {isItemsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isItemsExpanded && cartSummary?.items && (
              <div className="p-5 pt-0 border-t border-slate-100 space-y-3.5 divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {cartSummary.items.map((item) => (
                  <div key={item.id} className="pt-3 flex items-center gap-3 text-xs">
                    <div className="relative w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {item.imageUrl ? (
                        <Image
                          src={item.imageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <ShoppingBag className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 truncate">{item.productName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Qty: {item.quantity}</span>
                        {item.variantSize && <span>• Size: {item.variantSize}</span>}
                        {item.variantColor && <span>• Color: {item.variantColor}</span>}
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-right shrink-0">
                      {brandConfig.currency.symbol}{Number(item.totalPrice).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Summary Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Order Total Summary</span>
              <span className="text-[11px] font-bold text-slate-400">All Taxes Included</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({summary.itemCount} items)</span>
                <span className="font-bold text-slate-900">{brandConfig.currency.symbol}{summary.subtotal.toFixed(2)}</span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between items-center text-emerald-700 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Coupon Discount</span>
                  </div>
                  <span className="font-black text-emerald-800">
                    -{brandConfig.currency.symbol}{summary.discount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Shipping Cost</span>
                <span className="font-bold text-slate-900">
                  {summary.shippingCost === 0 ? (
                    <span className="text-emerald-700 uppercase font-black">Free Shipping</span>
                  ) : (
                    `${brandConfig.currency.symbol}${summary.shippingCost.toFixed(2)}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold text-slate-900">{brandConfig.currency.symbol}{summary.taxAmount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-base font-black text-slate-900 pt-3 border-t border-slate-100">
                <span>Payable Amount</span>
                <span className="text-indigo-600 text-lg">
                  {brandConfig.currency.symbol}{summary.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Trust Assurance Footer */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-[10px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Products</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Easy 7-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
