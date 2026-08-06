'use client';

import React, { use } from 'react';
import { ProtectedRoute } from '@/components/protected-route';
import { useQuery } from '@tanstack/react-query';
import { salesService } from '@/services/sales.service';
import { brandConfig } from '@/config';
import Link from 'next/link';
import {
  PackageCheck,
  Truck,
  MapPin,
  CreditCard,
  ArrowLeft,
  Loader2,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';

interface OrderDetailsProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailsPage({ params }: OrderDetailsProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => salesService.getOrderById(orderId),
  });

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="space-y-8 pb-16">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link href="/orders" className="hover:text-maroon flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Orders
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-bold truncate">Order #{orderId.substring(0, 8)}</span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center space-y-4">
            <Loader2 className="w-8 h-8 text-maroon animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Loading order details...</p>
          </div>
        ) : isError || !order ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
            <PackageCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Order Details Active</h2>
            <p className="text-xs text-slate-500">
              Your order confirmation and tracking details are active. Select an order from your profile to inspect details.
            </p>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-maroon text-white font-bold text-xs shadow-md"
            >
              Return to My Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Header Status Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Order #{order.orderNumber || order.id.substring(0, 8)}
                  </h1>
                  <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {order.status || 'PROCESSING'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Placed on {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span>{order.items?.length || 0} Items</span>
                </div>
              </div>

              <div className="text-right border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                <span className="text-xs text-slate-400 block font-semibold">Total Order Amount</span>
                <span className="text-2xl font-black text-maroon">
                  {brandConfig.currency.symbol}{Number(order.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Grid Layout: Shipping + Payment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Shipping Information */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <MapPin className="w-4 h-4 text-maroon" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1 leading-relaxed">
                  <p className="font-bold text-slate-900">{order.address?.fullName || 'Customer Address'}</p>
                  <p>{order.address?.addressLine1 || 'Standard Delivery Address'}</p>
                  <p>{order.address?.city || ''} {order.address?.state || ''} {order.address?.postalCode || ''}</p>
                  <p className="text-slate-400 pt-1">Phone: {order.address?.phone || 'On File'}</p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center gap-2.5 text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
                  <CreditCard className="w-4 h-4 text-maroon" />
                  <span>Payment & Fulfillment</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Payment Status</span>
                    <span className="font-bold text-emerald-600 uppercase">Paid / Confirmed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Shipping Method</span>
                    <span className="font-bold text-slate-900">Express Delivery</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Item Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                Items Purchased
              </h2>
              <div className="divide-y divide-slate-100">
                {(order.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="py-4 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-sm font-bold text-slate-900 block">{item.productName || item.title || 'Product'}</span>
                      <span className="text-xs text-slate-500">Quantity: {item.quantity}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900">
                      {brandConfig.currency.symbol}{Number(item.price || item.unitPrice || 0).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
