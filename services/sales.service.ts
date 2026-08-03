import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import {
  Coupon,
  CouponStats,
  Customer,
  CustomerDetails,
  CustomerStats,
  Invoice,
  Order,
  OrderStats,
  PaginationMeta,
  Review,
  ReviewStats,
} from '@/types/sales.types';

export const salesService = {
  // ==================== ORDERS ====================
  getOrders: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<Order[]>>('/orders', { params });
    return {
      orders: res.data.data,
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  getOrderById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<Order>>(`/orders/${id}`);
    return res.data.data;
  },

  updateOrderStatus: async (id: string, status: string, remarks?: string) => {
    const res = await apiClient.patch<ApiEnvelope<Order>>(`/orders/${id}/status`, { status, remarks });
    return res.data.data;
  },

  cancelOrder: async (id: string, reason?: string) => {
    const res = await apiClient.post<ApiEnvelope<Order>>(`/orders/${id}/cancel`, { reason });
    return res.data.data;
  },

  getInvoice: async (orderId: string) => {
    const res = await apiClient.get<ApiEnvelope<Invoice>>(`/orders/${orderId}/invoice`);
    return res.data.data;
  },

  getOrderStats: async () => {
    const res = await apiClient.get<ApiEnvelope<OrderStats>>('/orders/stats');
    return res.data.data;
  },

  exportOrdersCsv: async (params?: Record<string, any>) => {
    const res = await apiClient.get('/orders/export', {
      params,
      responseType: 'blob',
    });
    return res.data;
  },

  // ==================== CUSTOMERS ====================
  getCustomers: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<Customer[]>>('/customers', { params });
    return {
      customers: res.data.data,
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  getCustomerDetails: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<CustomerDetails>>(`/customers/${id}`);
    return res.data.data;
  },

  updateCustomerStatus: async (id: string, status: string) => {
    const res = await apiClient.patch<ApiEnvelope<Customer>>(`/customers/${id}/status`, { status });
    return res.data.data;
  },

  getCustomerStats: async () => {
    const res = await apiClient.get<ApiEnvelope<CustomerStats>>('/customers/stats');
    return res.data.data;
  },

  // ==================== COUPONS ====================
  getCoupons: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<Coupon[]>>('/coupons', { params });
    return {
      coupons: res.data.data,
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  getCouponById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<Coupon>>(`/coupons/${id}`);
    return res.data.data;
  },

  createCoupon: async (data: Partial<Coupon>) => {
    const res = await apiClient.post<ApiEnvelope<Coupon>>('/coupons', data);
    return res.data.data;
  },

  updateCoupon: async (id: string, data: Partial<Coupon>) => {
    const res = await apiClient.put<ApiEnvelope<Coupon>>(`/coupons/${id}`, data);
    return res.data.data;
  },

  deleteCoupon: async (id: string) => {
    const res = await apiClient.delete<ApiEnvelope<null>>(`/coupons/${id}`);
    return res.data.data;
  },

  getCouponStats: async () => {
    const res = await apiClient.get<ApiEnvelope<CouponStats>>('/coupons/stats');
    return res.data.data;
  },

  // ==================== REVIEWS ====================
  getReviews: async (params?: Record<string, any>) => {
    const res = await apiClient.get<ApiEnvelope<Review[]>>('/reviews', { params });
    return {
      reviews: res.data.data,
      meta: res.data.meta as PaginationMeta | undefined,
    };
  },

  getReviewById: async (id: string) => {
    const res = await apiClient.get<ApiEnvelope<Review>>(`/reviews/${id}`);
    return res.data.data;
  },

  approveReview: async (id: string) => {
    const res = await apiClient.patch<ApiEnvelope<Review>>(`/reviews/${id}/approve`);
    return res.data.data;
  },

  rejectReview: async (id: string) => {
    const res = await apiClient.patch<ApiEnvelope<Review>>(`/reviews/${id}/reject`);
    return res.data.data;
  },

  deleteReview: async (id: string) => {
    const res = await apiClient.delete<ApiEnvelope<null>>(`/reviews/${id}`);
    return res.data.data;
  },

  getReviewStats: async () => {
    const res = await apiClient.get<ApiEnvelope<ReviewStats>>('/reviews/stats');
    return res.data.data;
  },
};
