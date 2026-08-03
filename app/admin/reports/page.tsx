'use client';

import React, { useState } from 'react';
import {
  useCouponReport,
  useCustomerReport,
  useDashboardAnalytics,
  useInventoryReport,
  useOrderReport,
  useProductReport,
  useReviewReport,
  useSalesReport,
} from '@/hooks/use-reports';
import { KPICard } from '@/components/reports/kpi-card';
import { SalesTrendChart } from '@/components/reports/sales-trend-chart';
import { OrderStatusPieChart } from '@/components/reports/order-status-pie-chart';
import { CategorySalesBarChart } from '@/components/reports/category-sales-bar-chart';
import { ReportExportBar } from '@/components/reports/report-export-bar';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Button,
  Select,
  DatePicker,
  Tabs,
  Tag,
  Progress,
  Badge,
} from 'antd';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  Ticket,
  Star,
  Calendar,
  AlertTriangle,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function AdminReportsPage() {
  const [dateRangePreset, setDateRangePreset] = useState<'today' | '7days' | '30days' | 'custom'>('30days');
  const [customDates, setCustomDates] = useState<[string | undefined, string | undefined]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const startDate = customDates[0];
  const endDate = customDates[1];

  const { data: analytics, isLoading: isAnalyticsLoading } = useDashboardAnalytics(startDate, endDate);
  const { data: salesData } = useSalesReport(startDate, endDate);
  const { data: ordersData } = useOrderReport(startDate, endDate);
  const { data: productsData } = useProductReport();
  const { data: customersData } = useCustomerReport();
  const { data: inventoryData } = useInventoryReport();
  const { data: couponsData } = useCouponReport();
  const { data: reviewsData } = useReviewReport();

  const handleDatePresetChange = (val: 'today' | '7days' | '30days' | 'custom') => {
    setDateRangePreset(val);
    if (val === 'today') {
      setCustomDates([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    } else if (val === '7days') {
      setCustomDates([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    } else if (val === '30days') {
      setCustomDates([dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    }
  };

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs print:hidden">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Business Intelligence & Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Reports & Analytics Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Preset Picker */}
          <Select
            value={dateRangePreset}
            onChange={handleDatePresetChange}
            className="w-36"
            size="middle"
          >
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="7days">Last 7 Days</Select.Option>
            <Select.Option value="30days">Last 30 Days</Select.Option>
            <Select.Option value="custom">Custom Range</Select.Option>
          </Select>

          {dateRangePreset === 'custom' && (
            <RangePicker
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setCustomDates([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                }
              }}
              className="rounded-xl"
            />
          )}

          <ReportExportBar />
        </div>
      </div>

      {/* Main Tabbed Analytics Interface */}
      <Tabs
        defaultActiveKey="overview"
        className="reports-tabs"
        items={[
          {
            key: 'overview',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <BarChart3 className="w-4 h-4" /> Executive Overview
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                {/* Executive Top Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard
                    title="Total Revenue"
                    value={analytics?.sales?.totalRevenue || 0}
                    change={14.2}
                    icon={DollarSign}
                    colorScheme="indigo"
                  />
                  <KPICard
                    title="Total Orders"
                    value={analytics?.orders?.totalOrders || 0}
                    change={8.7}
                    icon={ShoppingBag}
                    colorScheme="emerald"
                  />
                  <KPICard
                    title="Active Customers"
                    value={analytics?.customers?.activeCustomers || 0}
                    change={11.3}
                    icon={Users}
                    colorScheme="purple"
                  />
                  <KPICard
                    title="Inventory Valuation"
                    value={analytics?.inventory?.totalInventoryValue || 0}
                    subtitle={`${analytics?.inventory?.totalStockUnits || 0} total units in stock`}
                    icon={Package}
                    colorScheme="amber"
                  />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <SalesTrendChart data={analytics?.sales?.trend} />
                  </div>
                  <OrderStatusPieChart data={analytics?.orders?.statusBreakdown} />
                </div>

                {/* Bottom Row Grids */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <CategorySalesBarChart data={analytics?.products?.categoryDistribution} />

                  {/* Top Selling Products Summary Card */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-base">Top Performing Products</h3>
                        <p className="text-xs text-slate-500 font-medium">Best sellers by revenue generation</p>
                      </div>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {analytics?.products?.bestSelling?.map((prod) => (
                        <div key={prod.productId} className="py-3 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{prod.name}</span>
                            <span className="text-[11px] text-slate-400">{prod.quantitySold} units sold</span>
                          </div>
                          <span className="font-black text-indigo-600 dark:text-indigo-400">
                            ₹{Number(prod.revenueGenerated).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'sales',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <DollarSign className="w-4 h-4" /> Sales Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard title="Total Gross Sales" value={salesData?.grossSales || 0} icon={DollarSign} colorScheme="indigo" />
                  <KPICard title="Total Discounts" value={salesData?.totalDiscount || 0} icon={Tag as any} colorScheme="rose" />
                  <KPICard title="Net Sales" value={salesData?.netSales || 0} icon={TrendingUp} colorScheme="emerald" />
                  <KPICard title="Average Order Value" value={salesData?.averageOrderValue || 0} icon={ShoppingBag} colorScheme="purple" />
                </div>

                <SalesTrendChart data={salesData?.trend} />
              </div>
            ),
          },
          {
            key: 'orders',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <ShoppingBag className="w-4 h-4" /> Order Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <KPICard title="Total Orders" value={ordersData?.totalOrders || 0} icon={ShoppingBag} colorScheme="indigo" />
                  <KPICard title="Delivered Orders" value={ordersData?.completed || 0} icon={ShoppingBag} colorScheme="emerald" />
                  <KPICard title="Pending Fulfillment" value={ordersData?.pending || 0} icon={ShoppingBag} colorScheme="amber" />
                  <KPICard title="Cancelled & Returned" value={(ordersData?.cancelled || 0) + (ordersData?.returned || 0)} icon={ShoppingBag} colorScheme="rose" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <OrderStatusPieChart data={ordersData?.statusBreakdown} />

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Payment Gateway Status</h3>
                    <div className="space-y-4">
                      {ordersData?.paymentStatus?.map((p) => (
                        <div key={p.status} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 dark:text-white">{p.status}</span>
                          <Tag color="green" className="font-bold rounded-md text-xs">{p.count} Orders</Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'products',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Package className="w-4 h-4" /> Product Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CategorySalesBarChart data={productsData?.categoryDistribution} />

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                    <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Low Stock & Out of Stock Alerts</h3>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                      {productsData?.lowStockProducts?.map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                            <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                          </div>
                          <Tag color={item.stock === 0 ? 'red' : 'orange'} className="font-bold rounded-lg text-xs">
                            {item.stock === 0 ? 'Out of Stock' : `${item.stock} left`}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: 'customers',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Users className="w-4 h-4" /> Customer Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <KPICard title="Total Customers" value={customersData?.totalCustomers || 0} icon={Users} colorScheme="indigo" />
                  <KPICard title="Active Accounts" value={customersData?.activeCustomers || 0} icon={Users} colorScheme="emerald" />
                  <KPICard title="Repeat Buyers" value={customersData?.repeatCustomers || 0} icon={Users} colorScheme="purple" />
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                  <h3 className="font-black text-slate-900 dark:text-white text-base mb-4">Top Customers by Lifetime Value (LTV)</h3>
                  <Table
                    dataSource={customersData?.topCustomers || []}
                    rowKey="id"
                    pagination={false}
                    columns={[
                      { title: 'Customer Name', dataIndex: 'name', key: 'name', render: (val) => <span className="font-bold text-xs text-slate-900 dark:text-white">{val}</span> },
                      { title: 'Email', dataIndex: 'email', key: 'email', render: (val) => <span className="text-xs text-slate-500">{val}</span> },
                      { title: 'Orders Placed', dataIndex: 'ordersCount', key: 'ordersCount', render: (val) => <span className="font-bold text-xs">{val} orders</span> },
                      { title: 'Total LTV Spend', dataIndex: 'totalSpent', key: 'totalSpent', render: (val) => <span className="font-black text-xs text-indigo-600">₹{Number(val).toLocaleString('en-IN')}</span> },
                    ]}
                  />
                </div>
              </div>
            ),
          },
          {
            key: 'inventory',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Package className="w-4 h-4" /> Inventory Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <KPICard title="Total Inventory Value" value={inventoryData?.totalInventoryValue || 0} icon={DollarSign} colorScheme="indigo" />
                  <KPICard title="Total Units in Stock" value={inventoryData?.totalStockUnits || 0} icon={Package} colorScheme="emerald" />
                  <KPICard title="Tracked SKUs" value={inventoryData?.totalSkus || 0} icon={Package} colorScheme="purple" />
                </div>
              </div>
            ),
          },
          {
            key: 'coupons',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Ticket className="w-4 h-4" /> Coupon Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <KPICard title="Active Promo Coupons" value={couponsData?.totalCoupons || 0} icon={Ticket} colorScheme="indigo" />
                  <KPICard title="Total Redemptions" value={couponsData?.totalRedemptions || 0} icon={Ticket} colorScheme="emerald" />
                </div>
              </div>
            ),
          },
          {
            key: 'reviews',
            label: (
              <span className="flex items-center gap-1.5 font-bold text-xs">
                <Star className="w-4 h-4" /> Review Reports
              </span>
            ),
            children: (
              <div className="space-y-6 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <KPICard title="Average Store Rating" value={`${reviewsData?.averageRating?.toFixed(1) || '5.0'} / 5.0`} icon={Star} colorScheme="amber" />
                  <KPICard title="Approved Customer Reviews" value={reviewsData?.approvedCount || 0} icon={Star} colorScheme="emerald" />
                  <KPICard title="Pending Review Moderation" value={reviewsData?.pendingCount || 0} icon={Star} colorScheme="rose" />
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
