import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salesService } from '@/services/sales.service';
import { Coupon } from '@/types/sales.types';
import { message } from 'antd';

// Query Keys
export const salesKeys = {
  allOrders: ['sales', 'orders'] as const,
  ordersList: (params?: Record<string, any>) => [...salesKeys.allOrders, 'list', params] as const,
  orderDetails: (id: string) => [...salesKeys.allOrders, 'details', id] as const,
  orderStats: ['sales', 'orders', 'stats'] as const,
  orderInvoice: (id: string) => [...salesKeys.allOrders, 'invoice', id] as const,

  allCustomers: ['sales', 'customers'] as const,
  customersList: (params?: Record<string, any>) => [...salesKeys.allCustomers, 'list', params] as const,
  customerDetails: (id: string) => [...salesKeys.allCustomers, 'details', id] as const,
  customerStats: ['sales', 'customers', 'stats'] as const,

  allCoupons: ['sales', 'coupons'] as const,
  couponsList: (params?: Record<string, any>) => [...salesKeys.allCoupons, 'list', params] as const,
  couponDetails: (id: string) => [...salesKeys.allCoupons, 'details', id] as const,
  couponStats: ['sales', 'coupons', 'stats'] as const,

  allReviews: ['sales', 'reviews'] as const,
  reviewsList: (params?: Record<string, any>) => [...salesKeys.allReviews, 'list', params] as const,
  reviewDetails: (id: string) => [...salesKeys.allReviews, 'details', id] as const,
  reviewStats: ['sales', 'reviews', 'stats'] as const,
};

// ==================== ORDERS HOOKS ====================
export const useOrders = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: salesKeys.ordersList(params),
    queryFn: () => salesService.getOrders(params),
  });
};

export const useOrderDetails = (id: string) => {
  return useQuery({
    queryKey: salesKeys.orderDetails(id),
    queryFn: () => salesService.getOrderById(id),
    enabled: Boolean(id),
  });
};

export const useOrderStats = () => {
  return useQuery({
    queryKey: salesKeys.orderStats,
    queryFn: salesService.getOrderStats,
  });
};

export const useInvoice = (orderId: string) => {
  return useQuery({
    queryKey: salesKeys.orderInvoice(orderId),
    queryFn: () => salesService.getInvoice(orderId),
    enabled: Boolean(orderId),
  });
};

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status, remarks }: { id: string; status: string; remarks?: string }) =>
      salesService.updateOrderStatus(id, status, remarks),
    onSuccess: (_, variables) => {
      message.success('Order status updated successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allOrders });
      queryClient.invalidateQueries({ queryKey: salesKeys.orderDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update order status');
    },
  });

  const cancelOrder = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      salesService.cancelOrder(id, reason),
    onSuccess: (_, variables) => {
      message.success('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allOrders });
      queryClient.invalidateQueries({ queryKey: salesKeys.orderDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to cancel order');
    },
  });

  return { updateStatus, cancelOrder };
};

// ==================== CUSTOMERS HOOKS ====================
export const useCustomers = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: salesKeys.customersList(params),
    queryFn: () => salesService.getCustomers(params),
  });
};

export const useCustomerDetails = (id: string) => {
  return useQuery({
    queryKey: salesKeys.customerDetails(id),
    queryFn: () => salesService.getCustomerDetails(id),
    enabled: Boolean(id),
  });
};

export const useCustomerStats = () => {
  return useQuery({
    queryKey: salesKeys.customerStats,
    queryFn: salesService.getCustomerStats,
  });
};

export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      salesService.updateCustomerStatus(id, status),
    onSuccess: (_, variables) => {
      message.success('Customer account status updated');
      queryClient.invalidateQueries({ queryKey: salesKeys.allCustomers });
      queryClient.invalidateQueries({ queryKey: salesKeys.customerDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update customer status');
    },
  });

  return { updateStatus };
};

// ==================== COUPONS HOOKS ====================
export const useCouponsList = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: salesKeys.couponsList(params),
    queryFn: () => salesService.getCoupons(params),
  });
};

export const useCouponDetails = (id: string) => {
  return useQuery({
    queryKey: salesKeys.couponDetails(id),
    queryFn: () => salesService.getCouponById(id),
    enabled: Boolean(id),
  });
};

export const useCouponStats = () => {
  return useQuery({
    queryKey: salesKeys.couponStats,
    queryFn: salesService.getCouponStats,
  });
};

export const useCouponMutations = () => {
  const queryClient = useQueryClient();

  const createCoupon = useMutation({
    mutationFn: (data: Partial<Coupon>) => salesService.createCoupon(data),
    onSuccess: () => {
      message.success('Coupon created successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allCoupons });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to create coupon');
    },
  });

  const updateCoupon = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Coupon> }) =>
      salesService.updateCoupon(id, data),
    onSuccess: (_, variables) => {
      message.success('Coupon updated successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allCoupons });
      queryClient.invalidateQueries({ queryKey: salesKeys.couponDetails(variables.id) });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to update coupon');
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) => salesService.deleteCoupon(id),
    onSuccess: () => {
      message.success('Coupon deleted successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allCoupons });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete coupon');
    },
  });

  return { createCoupon, updateCoupon, deleteCoupon };
};

// ==================== REVIEWS HOOKS ====================
export const useReviews = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: salesKeys.reviewsList(params),
    queryFn: () => salesService.getReviews(params),
  });
};

export const useReviewDetails = (id: string) => {
  return useQuery({
    queryKey: salesKeys.reviewDetails(id),
    queryFn: () => salesService.getReviewById(id),
    enabled: Boolean(id),
  });
};

export const useReviewStats = () => {
  return useQuery({
    queryKey: salesKeys.reviewStats,
    queryFn: salesService.getReviewStats,
  });
};

export const useReviewMutations = () => {
  const queryClient = useQueryClient();

  const approveReview = useMutation({
    mutationFn: (id: string) => salesService.approveReview(id),
    onSuccess: () => {
      message.success('Review approved successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allReviews });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to approve review');
    },
  });

  const rejectReview = useMutation({
    mutationFn: (id: string) => salesService.rejectReview(id),
    onSuccess: () => {
      message.success('Review rejected successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allReviews });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to reject review');
    },
  });

  const deleteReview = useMutation({
    mutationFn: (id: string) => salesService.deleteReview(id),
    onSuccess: () => {
      message.success('Review deleted successfully');
      queryClient.invalidateQueries({ queryKey: salesKeys.allReviews });
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Failed to delete review');
    },
  });

  return { approveReview, rejectReview, deleteReview };
};
