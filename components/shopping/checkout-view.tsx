'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { ProtectedRoute } from '@/shared';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  ChevronRight,
  Plus,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Tag,
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
    goToStep,
    nextStep,
    prevStep,
    submitOrder,
    isSubmittingOrder,
    createdOrderId,
  } = useCheckout();

  const { addresses, isLoading: loadingAddresses, createAddress, isCreating } = useAddresses();
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const { methods: shippingMethods, selectedMethod, setSelectedMethodId, shippingCost } = useShipping(
    cartSummary?.subtotal || 0,
    selectedAddress,
  );

  const { couponCode, discountAmount, applyCoupon, removeCoupon, isApplying } = useCoupons();
  const [couponInput, setCouponInput] = useState('');

  const { selectedGateway, setSelectedGateway, processPayment, isProcessing } = usePayment();

  const summary = useOrderSummary(shippingCost);

  // Address modal/form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    type: 'HOME' as const,
    isDefault: true,
  });

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAddress(newAddr);
    setShowAddressForm(false);
  };

  const handleFinalOrder = async () => {
    if (!selectedAddressId) return;

    // 1. Submit order to backend
    submitOrder({
      addressId: selectedAddressId,
      paymentMethod: selectedPaymentMethod,
      notes,
    });
  };

  if (currentStep === CheckoutStep.CONFIRMATION && createdOrderId) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Order Placed Successfully</span>
          <h1 className="text-3xl font-extrabold text-slate-900">Thank You for Your Order!</h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your order <strong className="text-slate-900">#{createdOrderId.slice(-8).toUpperCase()}</strong> has been confirmed and is being processed.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-3 max-w-md mx-auto text-xs text-slate-600">
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Customer Email</span>
            <strong className="text-slate-900">{user?.email}</strong>
          </div>
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span>Payment Method</span>
            <strong className="text-slate-900">{selectedPaymentMethod}</strong>
          </div>
          <div className="flex justify-between">
            <span>Total Paid</span>
            <strong className="text-slate-900">{brandConfig.currency.symbol}{summary.grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/orders"
            className="px-6 py-3 rounded-2xl bg-maroon hover:bg-maroon-dark text-white font-bold text-xs transition"
          >
            View Order Status
          </Link>
          <button
            onClick={async () => {
              try {
                toast.loading('Fetching invoice receipt...', { id: 'inv' });
                await checkoutService.downloadInvoice(createdOrderId);
                toast.success('Invoice receipt retrieved successfully', { id: 'inv' });
              } catch {
                toast.error('Invoice receipt unavailable', { id: 'inv' });
              }
            }}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-maroon text-white font-bold text-xs transition flex items-center gap-2"
          >
            Download Invoice
          </button>
          <Link
            href="/shop"
            className="px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (!hasItemsInCart && currentStep !== CheckoutStep.CONFIRMATION) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500">Add items to your shopping cart before initiating checkout.</p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-maroon text-white font-bold text-xs hover:bg-maroon-dark transition"
        >
          Explore Shop Catalog
        </Link>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="max-w-7xl mx-auto space-y-8 pb-16">
        {/* Page Title */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
            <p className="text-xs text-slate-500 mt-1">Complete your order securely</p>
          </div>
          <Link href="/cart" className="text-xs font-bold text-slate-600 hover:text-maroon flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </Link>
        </div>

        {/* Stepper Tabs Bar */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => goToStep(CheckoutStep.SHIPPING_ADDRESS)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              currentStep === CheckoutStep.SHIPPING_ADDRESS
                ? 'bg-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>1. Address</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

          <button
            onClick={() => goToStep(CheckoutStep.SHIPPING_METHOD)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              currentStep === CheckoutStep.SHIPPING_METHOD
                ? 'bg-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>2. Shipping</span>
          </button>
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />

          <button
            onClick={() => goToStep(CheckoutStep.PAYMENT_METHOD)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
              currentStep === CheckoutStep.PAYMENT_METHOD
                ? 'bg-maroon text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>3. Payment</span>
          </button>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns: Active Step Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Shipping Address */}
            {currentStep === CheckoutStep.SHIPPING_ADDRESS && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-maroon" />
                    Select Shipping Address
                  </h2>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Address Cards List */}
                {loadingAddresses ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading saved addresses...</div>
                ) : addresses.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between space-y-3 ${
                          selectedAddressId === addr.id
                            ? 'border-maroon bg-maroon-light/50 ring-2 ring-maroon/20'
                            : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase text-slate-900">{addr.fullName}</span>
                          <span className="text-[10px] font-bold uppercase text-maroon bg-maroon-light px-2 py-0.5 rounded-full">
                            {addr.type}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                        <div className="text-[11px] font-medium text-slate-500">Phone: {addr.phone}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                    <p>No saved addresses found.</p>
                    <p className="font-bold text-slate-800">Add a shipping address below to proceed.</p>
                  </div>
                )}

                {/* Add Address Form Modal */}
                {showAddressForm && (
                  <form onSubmit={handleAddAddressSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs">
                    <h3 className="font-bold text-slate-900 text-sm">New Delivery Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        required
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Street Address Line 1"
                        required
                        value={newAddr.addressLine1}
                        onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                        className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="City"
                        required
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="State / Province"
                        required
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Postal Code"
                        required
                        value={newAddr.postalCode}
                        onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                      <input
                        type="text"
                        placeholder="Country"
                        required
                        value={newAddr.country}
                        onChange={(e) => setNewAddr({ ...newAddr, country: e.target.value })}
                        className="px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-900"
                      />
                    </div>
                    <div className="flex gap-2 justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="px-4 py-2 rounded-xl bg-maroon text-white font-bold hover:bg-maroon-dark transition"
                      >
                        {isCreating ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-100">
                  <button
                    onClick={nextStep}
                    disabled={!selectedAddressId}
                    className="px-6 py-3 rounded-2xl bg-maroon hover:bg-maroon-dark disabled:opacity-50 text-white font-bold text-xs transition"
                  >
                    Continue to Shipping Method
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {currentStep === CheckoutStep.SHIPPING_METHOD && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-maroon" />
                  Select Shipping Method
                </h2>

                <div className="space-y-3">
                  {shippingMethods.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMethodId(m.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                        selectedMethod?.id === m.id
                          ? 'border-maroon bg-maroon-light/50 ring-2 ring-maroon/20'
                          : 'border-slate-200 bg-slate-50/50 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{m.name}</div>
                        <div className="text-[11px] text-slate-500">{m.description} • Est. {m.estimatedDays}</div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">
                        {m.isFree ? 'FREE' : `${brandConfig.currency.symbol}${m.cost.toFixed(2)}`}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="px-6 py-3 rounded-2xl bg-maroon hover:bg-maroon-dark text-white font-bold text-xs"
                  >
                    Continue to Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment Method & Review */}
            {currentStep === CheckoutStep.PAYMENT_METHOD && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-maroon" />
                  Select Payment Option
                </h2>

                <div className="space-y-3">
                  <div
                    className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/50 ring-2 ring-emerald-500/20 text-left transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">Cash on Delivery (COD)</span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white uppercase">
                          Enabled for Testing
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1 font-medium">
                        Pay cash directly upon delivery at your doorstep. No online payment gateway required.
                      </div>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  </div>
                </div>

                {/* Order Notes Input */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-700 block">Delivery Instructions / Order Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Provide any gate codes or delivery notes..."
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-100">
                  <button
                    onClick={prevStep}
                    className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinalOrder}
                    disabled={isSubmittingOrder}
                    className="px-8 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition shadow-lg flex items-center gap-2"
                  >
                    {isSubmittingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>Place Order via COD ({brandConfig.currency.symbol}{summary.grandTotal.toFixed(2)})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Financial Order Summary */}
          <div className="space-y-6">
            {/* Coupon Code Block */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Tag className="w-4 h-4 text-orange" />
                <span>Apply Promo Code</span>
              </div>
              {couponCode ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                  <span className="font-bold text-emerald-800">Coupon Code: {couponCode}</span>
                  <button onClick={removeCoupon} className="text-red-600 text-[11px] font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code..."
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs uppercase focus:outline-none focus:ring-2 focus:ring-maroon"
                  />
                  <button
                    onClick={() => {
                      if (couponInput.trim()) {
                        applyCoupon(couponInput.trim());
                        setCouponInput('');
                      }
                    }}
                    disabled={isApplying || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-maroon text-white text-xs font-bold hover:bg-maroon-dark disabled:opacity-50 transition"
                  >
                    Apply
                  </button>
                </div>
              )}
            </div>

            {/* Financial Summary Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Order Financial Summary</h3>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({summary.itemCount} items)</span>
                  <span className="font-semibold text-slate-900">{brandConfig.currency.symbol}{summary.subtotal.toFixed(2)}</span>
                </div>

                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{brandConfig.currency.symbol}{summary.discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Shipping Cost</span>
                  <span className="font-semibold text-slate-900">
                    {summary.shippingCost === 0 ? 'FREE' : `${brandConfig.currency.symbol}${summary.shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-slate-900">{brandConfig.currency.symbol}{summary.taxAmount.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-3 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span className="text-indigo-600">{brandConfig.currency.symbol}{summary.grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Guaranteed 256-bit SSL encrypted checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};
