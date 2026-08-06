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

const GUEST_CART_KEY = 'vistora_guest_cart';

export interface GuestCartItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  productName?: string;
  productSlug?: string;
  price?: number;
  imageUrl?: string;
}

export function getGuestCartFromStorage(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(GUEST_CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveGuestCartToStorage(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

export function buildGuestCartSummary(items: GuestCartItem[]): CartSummaryResponse {
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + (i.price || 0) * i.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const freeShippingThreshold = 150;
  const freeShippingEligible = subtotal >= freeShippingThreshold;
  const shipping = subtotal > 0 && !freeShippingEligible ? 15 : 0;
  const discount = 0;
  const total = subtotal + tax + shipping - discount;

  return {
    id: 'guest-cart',
    userId: 'guest',
    status: 'ACTIVE',
    couponCode: null,
    items: items.map((i) => ({
      id: i.id,
      productId: i.productId,
      productName: i.productName || 'Product',
      productSlug: i.productSlug || 'product',
      imageUrl: i.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=400',
      variantId: i.variantId || null,
      variantSku: null,
      variantColor: null,
      variantSize: null,
      quantity: i.quantity,
      unitPrice: i.price || 0,
      totalPrice: (i.price || 0) * i.quantity,
      availableStock: 99,
    })),
    subtotal,
    discount,
    tax,
    shipping,
    total,
    itemCount,
    freeShippingEligible,
    freeShippingThreshold,
  };
}

// ==================== CART HOOKS ====================
export const useCart = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<CartSummaryResponse>({
    queryKey: ['cart', isAuthenticated],
    queryFn: async () => {
      if (isAuthenticated) {
        return cartService.get();
      } else {
        const guestItems = getGuestCartFromStorage();
        return buildGuestCartSummary(guestItems);
      }
    },
  });
};

export const useCartMutations = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const addToCart = useMutation({
    mutationFn: async ({
      productId,
      variantId,
      quantity = 1,
      productName,
      productSlug,
      price,
      imageUrl,
    }: {
      productId: string;
      variantId?: string | null;
      quantity?: number;
      productName?: string;
      productSlug?: string;
      price?: number;
      imageUrl?: string;
    }) => {
      if (isAuthenticated) {
        return cartService.addItem(productId, variantId, quantity);
      } else {
        const items = getGuestCartFromStorage();
        const existingIndex = items.findIndex(
          (i) => i.productId === productId && (i.variantId || null) === (variantId || null)
        );

        if (existingIndex > -1) {
          items[existingIndex].quantity += quantity;
        } else {
          const itemId = `guest_${productId}_${variantId || 'default'}`;
          items.push({
            id: itemId,
            productId,
            variantId: variantId || null,
            quantity,
            productName,
            productSlug,
            price,
            imageUrl,
          });
        }
        saveGuestCartToStorage(items);
        return buildGuestCartSummary(items);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item added to shopping cart!');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to add item to cart');
    },
  });

  const updateCartItem = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: string; quantity: number }) => {
      if (isAuthenticated) {
        return cartService.updateItem(itemId, quantity);
      } else {
        const items = getGuestCartFromStorage();
        const target = items.find((i) => i.id === itemId);
        if (target) {
          target.quantity = quantity;
          saveGuestCartToStorage(items);
        }
        return buildGuestCartSummary(items);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Cart updated');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to update item quantity');
    },
  });

  const removeCartItem = useMutation({
    mutationFn: async (itemId: string) => {
      if (isAuthenticated) {
        return cartService.removeItem(itemId);
      } else {
        const items = getGuestCartFromStorage().filter((i) => i.id !== itemId);
        saveGuestCartToStorage(items);
        return buildGuestCartSummary(items);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Item removed from cart');
    },
    onError: (err: Error) => {
      toast.error(err.message || 'Failed to remove item');
    },
  });

  const clearCart = useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        return cartService.clear();
      } else {
        saveGuestCartToStorage([]);
        return buildGuestCartSummary([]);
      }
    },
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
