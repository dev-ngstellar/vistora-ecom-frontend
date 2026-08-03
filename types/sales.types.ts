export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'PACKED'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'RAZORPAY' | 'STRIPE' | 'COD';

export type ShipmentStatus =
  | 'PENDING'
  | 'READY_TO_SHIP'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'FAILED'
  | 'RETURNED';

export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BLOCKED' | 'DELETED';
export type CouponType = 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
export type CouponStatus = 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Address {
  id: string;
  userId: string;
  type: 'HOME' | 'OFFICE' | 'OTHER';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
  total: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    images: Array<{ imageUrl: string; altText?: string | null }>;
  };
  variant?: {
    id: string;
    sku: string;
    color?: string | null;
    size?: string | null;
  } | null;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  gatewayOrderId?: string | null;
  gatewayPaymentId?: string | null;
  amount: number;
  transactionReference?: string | null;
  paidAt?: string | null;
  failureReason?: string | null;
}

export interface Shipment {
  id: string;
  orderId: string;
  courierName?: string | null;
  trackingNumber?: string | null;
  trackingUrl?: string | null;
  shipmentStatus: ShipmentStatus;
  shippedAt?: string | null;
  expectedDelivery?: string | null;
  deliveredAt?: string | null;
  remarks?: string | null;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  status: 'GENERATED' | 'SENT' | 'CANCELLED';
  invoiceUrl?: string | null;
  generatedAt: string;
  sentAt?: string | null;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  remarks?: string | null;
  updatedBy?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
  };
  address?: Address;
  items: OrderItem[];
  payments: Payment[];
  shipment?: Shipment | null;
  invoice?: Invoice | null;
  statusHistory?: OrderStatusHistory[];
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  status: AccountStatus;
  lastLoginAt?: string | null;
  createdAt: string;
  totalOrders: number;
  totalSpending: number;
  lastOrderDate?: string | null;
  defaultAddress?: Address | null;
}

export interface CustomerDetails {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    gender?: string | null;
    dateOfBirth?: string | null;
    status: AccountStatus;
    emailVerified: boolean;
    lastLoginAt?: string | null;
    createdAt: string;
    updatedAt: string;
  };
  stats: {
    totalOrders: number;
    totalSpending: number;
    lastOrderDate?: string | null;
    wishlistItemsCount: number;
    addressCount: number;
  };
  addresses: Address[];
  orders: Order[];
  wishlist: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      slug: string;
      price: number;
      images: Array<{ imageUrl: string }>;
    };
  }>;
  activityLog: Array<{
    id: string;
    module: string;
    action: string;
    createdAt: string;
  }>;
}

export interface CustomerStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  totalCustomerSpending: number;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  discount: number;
  usedAt: string;
  user?: {
    id: string;
    fullName: string;
    email: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    total: number;
  };
}

export interface Coupon {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  type: CouponType;
  value: number;
  minimumOrderAmount?: number | null;
  maximumDiscount?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
  usages?: CouponUsage[];
}

export interface CouponStats {
  totalCoupons: number;
  activeCoupons: number;
  expiredCoupons: number;
  totalDiscountIssued: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId?: string | null;
  rating: number;
  title?: string | null;
  comment?: string | null;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    images: Array<{ imageUrl: string }>;
  };
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    avatar?: string | null;
  };
  order?: {
    id: string;
    orderNumber: string;
    createdAt: string;
  } | null;
}

export interface ReviewStats {
  totalReviews: number;
  pendingReviews: number;
  approvedReviews: number;
  rejectedReviews: number;
  avgRating: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
