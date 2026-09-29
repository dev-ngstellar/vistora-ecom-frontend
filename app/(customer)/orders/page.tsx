'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ProtectedRoute } from '@/shared';
import { checkoutService } from '@/platform/checkout';
import { brandConfig } from '@/config';
import { InvoiceModal } from '@/components/sales/invoice-modal';
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
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

const getCourierTrackingUrl = (shipment: any): string => {
  if (!shipment) return 'https://www.tpcindia.com';

  // 1. Explicit trackingUrl entered by Admin
  if (shipment.trackingUrl && typeof shipment.trackingUrl === 'string' && shipment.trackingUrl.trim() !== '') {
    const url = shipment.trackingUrl.trim();
    return url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  }

  // 2. Direct official courier portal websites
  const name = (shipment.courierName || '').toLowerCase();
  if (name.includes('professional') || name.includes('tpc')) return 'https://www.tpcindia.com';
  if (name.includes('st courier') || name.includes('stc') || name.includes('st ')) return 'https://stcourier.com';
  if (name.includes('post') || name.includes('speed post') || name.includes('india post')) return 'https://www.indiapost.gov.in';
  if (name.includes('dtdc')) return 'https://www.dtdc.in';
  if (name.includes('franch')) return 'https://www.franchexpress.com';
  if (name.includes('trackon')) return 'https://trackon.in';
  if (name.includes('blue dart') || name.includes('bluedart')) return 'https://www.bluedart.com';
  if (name.includes('delhivery')) return 'https://www.delhivery.com';
  if (name.includes('xpressbees')) return 'https://www.xpressbees.com';
  if (name.includes('shadowfax')) return 'https://www.shadowfax.in';

  // 3. Default direct portal fallback
  return 'https://www.tpcindia.com';
};

export default function OrdersPage() {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['customer', 'orders'],
    queryFn: () => checkoutService.getMyOrders(),
  });

  const handleCopyTracking = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedTrackingId(text);
    toast.success('Courier tracking number copied!');
    setTimeout(() => setCopiedTrackingId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    const s = (status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
            <Truck className="w-3.5 h-3.5" /> Out for Delivery
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <Truck className="w-3.5 h-3.5" /> Shipped / Dispatched
          </span>
        );
      case 'PACKED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Clock className="w-3.5 h-3.5" /> Packed
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">
            <Clock className="w-3.5 h-3.5" /> Processing
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Confirmed
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
            <Clock className="w-3.5 h-3.5" /> {status}
          </span>
        );
    }
  };

  const handleViewInvoice = (order: any) => {
    setSelectedInvoiceOrder(order);
    setIsInvoiceModalOpen(true);
  };

  return (
    <ProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN', 'ADMIN', 'MANAGER']}>
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Package className="w-7 h-7 text-[#A50025]" />
              My Orders
            </h1>
            <p className="text-xs text-slate-500 mt-1">Track your courier shipments, order status, and download tax invoices.</p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A50025] hover:bg-[#83001D] text-white font-bold text-xs shadow-xs transition self-start sm:self-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Order Policy Notice */}
        <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div>
            <span className="font-bold text-slate-900 block">Need help with an order?</span>
            <span>Cancellations are accepted before dispatch. Damaged or missing grocery items must be reported within <strong>24 hours of delivery</strong>.</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/cancellation-refund" className="text-[#A50025] font-bold hover:underline">
              Refund Policy
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="text-slate-900 font-bold hover:underline">
              Support ({brandConfig.contactPhone})
            </Link>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#A50025] mx-auto" />
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
            <div className="w-16 h-16 bg-[#FFF0F3] text-[#A50025] rounded-full flex items-center justify-center mx-auto">
              <Package className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No Orders Found</h2>
            <p className="text-xs text-slate-500">You have not placed any orders yet. Start exploring our shop catalog!</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#A50025] text-white font-bold text-xs hover:bg-[#7D001C] transition"
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
              const shipment = order.shipment;
              const trackingUrl = shipment ? getCourierTrackingUrl(shipment) : '';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition hover:border-slate-300"
                >
                  {/* Order Summary Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-extrabold text-slate-900">#{order.orderNumber}</span>
                        {getStatusBadge(order.status)}

                        {shipment?.courierName && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-full border border-slate-200 shadow-2xs">
                            <Truck className="w-3.5 h-3.5 text-[#A50025]" />
                            <span>{shipment.courierName}</span>
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 justify-between sm:justify-end">
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Total Amount</div>
                        <div className="text-sm font-extrabold text-[#A50025]">
                          {brandConfig.currency.symbol}{Number(order.total).toFixed(2)}
                        </div>
                      </div>

                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  {isExpanded && (
                    <div className="p-5 border-t border-slate-100 space-y-5 bg-white text-xs">
                      {/* Live Courier Tracking Information Card */}
                      {shipment && (shipment.trackingNumber || shipment.courierName) && (
                        <div className="bg-gradient-to-r from-red-50/70 via-orange-50/40 to-amber-50/50 p-4 rounded-2xl border border-red-200/90 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-[#A50025] text-white flex items-center justify-center shrink-0 shadow-xs">
                                <Truck className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                  Courier Dispatch Details
                                </span>
                                <span className="font-extrabold text-slate-900 text-sm">
                                  {shipment.courierName || 'The Professional Couriers'}
                                </span>
                              </div>
                            </div>

                            {trackingUrl && (
                              <a
                                href={trackingUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A50025] hover:bg-[#7D001C] text-white font-bold text-xs shadow-xs transition shrink-0 cursor-pointer self-start sm:self-auto"
                              >
                                <span>Track on Courier Website</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>

                          <div className="pt-2.5 border-t border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700">
                            {shipment.trackingNumber ? (
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-slate-600">Tracking / Consignment ID:</span>
                                <div className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-red-200 font-mono font-bold text-slate-900 shadow-2xs">
                                  <span>{shipment.trackingNumber}</span>
                                  <button
                                    type="button"
                                    onClick={(e) => handleCopyTracking(e, shipment.trackingNumber)}
                                    className="text-[#A50025] hover:text-[#7D001C] cursor-pointer p-0.5"
                                    title="Copy tracking number"
                                  >
                                    {copiedTrackingId === shipment.trackingNumber ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span className="text-slate-500 font-medium italic">
                                Consignment receipt number will be updated once handed over to courier.
                              </span>
                            )}

                            <span className="text-[11px] text-slate-500 italic">
                              Dispatched from physical counter to your address
                            </span>
                          </div>
                        </div>
                      )}

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
                            <span className="text-[#A50025]">{brandConfig.currency.symbol}{Number(order.total).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => handleViewInvoice(order)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#A50025] text-white font-bold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
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

        {/* Invoice Modal for Customer */}
        <InvoiceModal
          order={selectedInvoiceOrder}
          open={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  );
}
