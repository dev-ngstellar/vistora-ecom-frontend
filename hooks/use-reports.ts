import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reports.service';

const ALL_REPORTS_KEY = 'reports';

export const reportKeys = {
  all: [ALL_REPORTS_KEY] as const,
  dashboard: (startDate?: string, endDate?: string) => [ALL_REPORTS_KEY, 'dashboard', startDate, endDate] as const,
  sales: (startDate?: string, endDate?: string) => [ALL_REPORTS_KEY, 'sales', startDate, endDate] as const,
  orders: (startDate?: string, endDate?: string) => [ALL_REPORTS_KEY, 'orders', startDate, endDate] as const,
  products: [ALL_REPORTS_KEY, 'products'] as const,
  customers: [ALL_REPORTS_KEY, 'customers'] as const,
  inventory: [ALL_REPORTS_KEY, 'inventory'] as const,
  coupons: [ALL_REPORTS_KEY, 'coupons'] as const,
  reviews: [ALL_REPORTS_KEY, 'reviews'] as const,
};

export const useDashboardAnalytics = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.dashboard(startDate, endDate),
    queryFn: () => reportsService.getDashboardAnalytics(startDate, endDate),
  });
};

export const useSalesReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.sales(startDate, endDate),
    queryFn: () => reportsService.getSalesReport(startDate, endDate),
  });
};

export const useOrderReport = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: reportKeys.orders(startDate, endDate),
    queryFn: () => reportsService.getOrderReport(startDate, endDate),
  });
};

export const useProductReport = () => {
  return useQuery({
    queryKey: reportKeys.products,
    queryFn: reportsService.getProductReport,
  });
};

export const useCustomerReport = () => {
  return useQuery({
    queryKey: reportKeys.customers,
    queryFn: reportsService.getCustomerReport,
  });
};

export const useInventoryReport = () => {
  return useQuery({
    queryKey: reportKeys.inventory,
    queryFn: reportsService.getInventoryReport,
  });
};

export const useCouponReport = () => {
  return useQuery({
    queryKey: reportKeys.coupons,
    queryFn: reportsService.getCouponReport,
  });
};

export const useReviewReport = () => {
  return useQuery({
    queryKey: reportKeys.reviews,
    queryFn: reportsService.getReviewReport,
  });
};
