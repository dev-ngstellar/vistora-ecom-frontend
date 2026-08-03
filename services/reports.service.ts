import { apiClient } from '@/lib/axios';
import { ApiEnvelope } from '@/types/auth.types';
import {
  CouponReport,
  CustomerReport,
  DashboardAnalytics,
  InventoryReport,
  OrderReport,
  ProductReport,
  ReviewReport,
  SalesReport,
} from '@/types/reports.types';

export const reportsService = {
  getDashboardAnalytics: async (startDate?: string, endDate?: string) => {
    const res = await apiClient.get<ApiEnvelope<DashboardAnalytics>>('/reports/dashboard', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getSalesReport: async (startDate?: string, endDate?: string) => {
    const res = await apiClient.get<ApiEnvelope<SalesReport>>('/reports/sales', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getOrderReport: async (startDate?: string, endDate?: string) => {
    const res = await apiClient.get<ApiEnvelope<OrderReport>>('/reports/orders', {
      params: { startDate, endDate },
    });
    return res.data.data;
  },

  getProductReport: async () => {
    const res = await apiClient.get<ApiEnvelope<ProductReport>>('/reports/products');
    return res.data.data;
  },

  getCustomerReport: async () => {
    const res = await apiClient.get<ApiEnvelope<CustomerReport>>('/reports/customers');
    return res.data.data;
  },

  getInventoryReport: async () => {
    const res = await apiClient.get<ApiEnvelope<InventoryReport>>('/reports/inventory');
    return res.data.data;
  },

  getCouponReport: async () => {
    const res = await apiClient.get<ApiEnvelope<CouponReport>>('/reports/coupons');
    return res.data.data;
  },

  getReviewReport: async () => {
    const res = await apiClient.get<ApiEnvelope<ReviewReport>>('/reports/reviews');
    return res.data.data;
  },
};
