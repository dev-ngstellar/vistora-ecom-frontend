export interface SalesReport {
  totalRevenue: number;
  grossSales: number;
  totalDiscount: number;
  netSales: number;
  averageOrderValue: number;
  totalOrders: number;
  trend: Array<{
    date: string;
    revenue: number;
    ordersCount: number;
  }>;
}

export interface OrderReport {
  totalOrders: number;
  completed: number;
  pending: number;
  cancelled: number;
  returned: number;
  recentOrders?: Array<{
    id: string;
    customer: string;
    amount: number;
    date: string;
    status: string;
  }>;
  statusBreakdown: Array<{
    name: string;
    count: number;
    color: string;
  }>;
  paymentStatus: Array<{
    status: string;
    count: number;
  }>;
}

export interface ProductReport {
  bestSelling: Array<{
    productId: string;
    name: string;
    quantitySold: number;
    revenueGenerated: number;
  }>;
  lowStockProducts: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number | string;
  }>;
  outOfStockCount: number;
  lowStockCount: number;
  categoryDistribution: Array<{ name: string; count: number }>;
  brandDistribution: Array<{ name: string; count: number }>;
}

export interface CustomerReport {
  totalCustomers: number;
  activeCustomers: number;
  repeatCustomers: number;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    totalSpent: number;
    ordersCount: number;
  }>;
}

export interface InventoryReport {
  totalStockUnits: number;
  totalInventoryValue: number;
  totalSkus: number;
  restockAlerts: Array<{
    id: string;
    name: string;
    sku: string;
    stock: number;
    price: number | string;
  }>;
}

export interface CouponReport {
  totalCoupons: number;
  totalRedemptions: number;
  coupons: Array<{
    id: string;
    code: string;
    discountType: string;
    discountValue: number | string;
    usageCount: number;
    usageLimit?: number | null;
    isActive: boolean;
  }>;
}

export interface ReviewReport {
  totalReviews: number;
  approvedCount: number;
  pendingCount: number;
  averageRating: number;
  recentReviews?: Array<{
    id: string;
    productName: string;
    customerName: string;
    rating: number;
    title?: string;
    comment: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
  }>;
  ratingDistribution: Array<{
    stars: string;
    count: number;
  }>;
}

export interface DashboardAnalytics {
  sales: SalesReport;
  orders: OrderReport;
  products: ProductReport;
  customers: CustomerReport;
  inventory: InventoryReport;
  coupons: CouponReport;
  reviews: ReviewReport;
}
