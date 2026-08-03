'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  cartService,
  wishlistService,
  couponService,
  shippingService,
} from '@/services/shopping.service';
import {
  CartSummaryResponse,
  CouponResponse,
  ShippingEstimateResponse,
  WishlistSummaryResponse,
} from '@/types/shopping.types';
import { useAuth } from '@/context/auth-context';

// ==================== CART HOOKS ====================
export const useCart = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<CartSummaryResponse>({
    queryKey: ['cart'],
    queryFn: () => cartService.get(),
    enabled: isAuthenticated,
  });
};

export const useCartMutations = () => {
  const queryClient = useQueryClient();

  const addToCart = useMutation({
    mutationFn: ({
      productId,
      variantId,
      quantity,
    }: {
      productId: string;
      variantId?: string | null;
      quantity?: number;
    }) => cartService.addItem(productId, variantId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item added to shopping cart!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add item to cart');
    },
  });

  const updateCartItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart updated');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update item quantity');
    },
  });

  const removeCartItem = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove item');
    },
  });

  const clearCart = useMutation({
    mutationFn: () => cartService.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Shopping cart cleared');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to clear cart');
    },
  });

  const applyCoupon = useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Coupon code applied successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to apply coupon code');
    },
  });

  const removeCoupon = useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Coupon code removed');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove coupon code');
    },
  });

  return {
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  };
};

// ==================== WISHLIST HOOKS ====================
export const useWishlist = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<WishlistSummaryResponse>({
    queryKey: ['wishlist'],
    queryFn: () => wishlistService.get(),
    enabled: isAuthenticated,
  });
};

export const useWishlistCount = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<number>({
    queryKey: ['wishlist', 'count'],
    queryFn: () => wishlistService.getCount(),
    enabled: isAuthenticated,
  });
};

export const useWishlistMutations = () => {
  const queryClient = useQueryClient();

  const addToWishlist = useMutation({
    mutationFn: ({ productId, variantId }: { productId: string; variantId?: string | null }) =>
      wishlistService.addItem(productId, variantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Item saved to your wishlist!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to save to wishlist');
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: (itemId: string) => wishlistService.removeItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Item removed from wishlist');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove item');
    },
  });

  const moveToCart = useMutation({
    mutationFn: (itemId: string) => wishlistService.moveToCart(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item moved to shopping cart!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to move item to cart');
    },
  });

  return {
    addToWishlist,
    removeFromWishlist,
    moveToCart,
  };
};

// ==================== COUPON ADMIN HOOKS ====================
export const useCoupons = () => {
  return useQuery<CouponResponse[]>({
    queryKey: ['coupons'],
    queryFn: () => couponService.listPublic(),
  });
};

export const useCouponMutations = () => {
  const queryClient = useQueryClient();

  const createCoupon = useMutation({
    mutationFn: (data: Partial<CouponResponse>) => couponService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon created successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to create coupon');
    },
  });

  const updateCoupon = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CouponResponse> }) =>
      couponService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon updated successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update coupon');
    },
  });

  const deleteCoupon = useMutation({
    mutationFn: (id: string) => couponService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon deleted successfully!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to delete coupon');
    },
  });

  return { createCoupon, updateCoupon, deleteCoupon };
};

// ==================== SHIPPING ESTIMATE HOOK ====================
export const useShippingEstimate = (
  subtotal: number,
  postalCode?: string,
  country?: string,
) => {
  return useQuery<ShippingEstimateResponse>({
    queryKey: ['shipping', subtotal, postalCode, country],
    queryFn: () => shippingService.estimate(subtotal, postalCode, country),
    enabled: subtotal > 0,
  });
};
