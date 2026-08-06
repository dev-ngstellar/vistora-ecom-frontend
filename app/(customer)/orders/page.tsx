'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared';
import { checkoutService } from '@/platform/checkout';
import { brandConfig } from '@/config';
import toast from 'react-hot-toast';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  ArrowRight,
  Loader2,
} from 'lucide-react';

export default function OrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['customer', 'orders'],
    queryFn: () => checkoutService.getMyOrders(),
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        );
    }
  };

  const handleDownloadInvoice = async (orderId: string, orderNumber: string) => {
    try {
      toast.loading('Generating invoice...', { id: 'inv' });
      const invoice = await checkoutService.downloadInvoice(orderId);
      toast.success(`Invoice generated for #${orderNumber}`, { id: 'inv' });
    } catch {
      toast.error('Unable to fetch invoice details', { id: 'inv' });
    }
  };

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-7 h-7 text-maroon" />
              My Orders
            </h1>
            <p className="text-xs text-slate-500 mt-1">Track your recent order history and download invoice receipts.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-maroon hover:bg-maroon-dark text-white font-bold text-xs shadow-xs transition self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-maroon mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Fetching your order history...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-200 text-center space-y-2">
            <p className="text-xs font-bold text-red-700">Failed to load order history.</p>
            <p className="text-[11px] text-red-500">Please refresh or check your internet connection.</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="max-w-md mx-auto py-16 text-center space-y-4">
            <div className="w-16 h-16 bg-maroon-light text-maroon rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Orders Found</h2>
            <p className="text-xs text-slate-500">You have not placed any orders yet. Start exploring our shop catalog!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-maroon text-white font-bold text-xs hover:bg-maroon-dark transition"
            >
              <span>Explore Shop Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Orders List */}
        {!isLoading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const isExpanded = expandedOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition hover:border-slate-300"
                >
                  {/* Order Summary Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900">#{order.orderNumber}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Total Amount</div>
                        <div className="text-sm font-extrabold text-maroon">
                          {brandConfig.currency.symbol}{Number(order.total).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-50 transition"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 space-y-5 bg-white text-xs">
                      {/* Order Items Table */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider">Ordered Items</h4>
                        <div className="divide-y divide-slate-100">
                          {order.items?.map((item: any) => (
                            <div key={item.id} className="py-2.5 flex items-center justify-between gap-4">
                              <div>
                                <div className="font-bold text-slate-900">{item.productName}</div>
                                <div className="text-[11px] text-slate-400">SKU: {item.sku} • Qty: {item.quantity}</div>
                              </div>
                              <div className="font-bold text-slate-900">
                                {brandConfig.currency.symbol}{Number(item.total).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Address & Financial Breakdown */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                        {/* Address */}
                        <div className="space-y-1 text-slate-600 bg-slate-50 p-3 rounded-xl">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase">Delivery Address</span>
                          {order.address ? (
                            <p className="text-[11px] leading-relaxed">
                              <strong>{order.address.fullName}</strong><br />
                              {order.address.addressLine1}, {order.address.city}, {order.address.postalCode}
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-400">Address detail unavailable</p>
                          )}
                        </div>

                        {/* Financial Breakdown */}
                        <div className="space-y-1.5 text-slate-600 bg-slate-50 p-3 rounded-xl">
                          <span className="font-bold text-slate-900 block text-[11px] uppercase">Financial Breakdown</span>
                          <div className="flex justify-between text-[11px]">
                            <span>Subtotal</span>
                            <span className="font-semibold text-slate-900">{brandConfig.currency.symbol}{Number(order.subtotal).toFixed(2)}</span>
                          </div>
                          {Number(order.discount) > 0 && (
                            <div className="flex justify-between text-[11px] text-emerald-600 font-semibold">
                              <span>Discount</span>
                              <span>-{brandConfig.currency.symbol}{Number(order.discount).toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-[11px]">
                            <span>Shipping</span>
                            <span className="font-semibold text-slate-900">{Number(order.shipping) === 0 ? 'FREE' : `${brandConfig.currency.symbol}${Number(order.shipping).toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between text-[11px]">
                            <span>Tax</span>
                            <span className="font-semibold text-slate-900">{brandConfig.currency.symbol}{Number(order.tax).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold text-slate-900 pt-1 border-t border-slate-200">
                            <span>Grand Total</span>
                            <span className="text-indigo-600">{brandConfig.currency.symbol}{Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleDownloadInvoice(order.id, order.orderNumber)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition shadow-xs"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Invoice</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
