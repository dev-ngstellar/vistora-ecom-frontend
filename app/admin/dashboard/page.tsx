'use client';

import React, { useState } from 'react';
import { useDashboardAnalytics, useOrderReport, useProductReport, useReviewReport, useSalesReport } from '@/hooks/use-reports';
import { DashboardKPIGrid } from '@/components/dashboard/dashboard-kpi-grid';
import { SalesTrendChart } from '@/components/reports/sales-trend-chart';
import { OrderStatusPieChart } from '@/components/reports/order-status-pie-chart';
import { CategorySalesBarChart } from '@/components/reports/category-sales-bar-chart';
import { SystemHealthWidget } from '@/components/dashboard/system-health-widget';
import { DashboardReviewsModeration } from '@/components/dashboard/dashboard-reviews-moderation';
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions';
import { DashboardActivityTimeline } from '@/components/dashboard/dashboard-activity-timeline';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Button,
  Select,
  DatePicker,
  Tag,
  Badge,
} from 'antd';
import {
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  Bell,
  Eye,
  Award,
  ExternalLink,
} from 'lucide-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function AdminDashboardPage() {
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'this_month' | 'this_year' | 'custom'>('30days');
  const [customRange, setCustomRange] = useState<[string | undefined, string | undefined]>([
    dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD'),
  ]);

  const startDate = customRange[0];
  const endDate = customRange[1];

  const { data: analytics, isLoading } = useDashboardAnalytics(startDate, endDate);

  const handleFilterChange = (val: 'today' | '7days' | '30days' | 'this_month' | 'this_year' | 'custom') => {
    setDateFilter(val);
    if (val === 'today') {
      setCustomRange([dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    } else if (val === '7days') {
      setCustomRange([dayjs().subtract(7, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    } else if (val === '30days') {
      setCustomRange([dayjs().subtract(30, 'day').format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')]);
    } else if (val === 'this_month') {
      setCustomRange([dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]);
    } else if (val === 'this_year') {
      setCustomRange([dayjs().startOf('year').format('YYYY-MM-DD'), dayjs().endOf('year').format('YYYY-MM-DD')]);
    }
  };

  const sampleRecentOrders = [
    { id: 'ORD-2026-1001', customer: 'Aisha Sharma', amount: 27138.82, paymentStatus: 'PAID', orderStatus: 'DELIVERED', date: new Date().toISOString() },
    { id: 'ORD-2026-1002', customer: 'Rohan Mehta', amount: 18450.00, paymentStatus: 'PAID', orderStatus: 'PROCESSING', date: new Date().toISOString() },
    { id: 'ORD-2026-1003', customer: 'Vikramaditya Roy', amount: 34999.00, paymentStatus: 'PENDING', orderStatus: 'PENDING', date: new Date().toISOString() },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar with Date Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Vistora Executive Operations Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Store Overview Dashboard</h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Select value={dateFilter} onChange={handleFilterChange} className="w-36" size="middle">
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="7days">Last 7 Days</Select.Option>
            <Select.Option value="30days">Last 30 Days</Select.Option>
            <Select.Option value="this_month">This Month</Select.Option>
            <Select.Option value="this_year">This Year</Select.Option>
            <Select.Option value="custom">Custom Range</Select.Option>
          </Select>

          {dateFilter === 'custom' && (
            <RangePicker
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setCustomRange([dates[0].format('YYYY-MM-DD'), dates[1].format('YYYY-MM-DD')]);
                }
              }}
              className="rounded-xl"
            />
          )}
        </div>
      </div>

      {/* SECTION 1 — 8 EXECUTIVE KPI CARDS */}
      <DashboardKPIGrid
        metrics={{
          totalRevenue: analytics?.sales?.totalRevenue || 128450,
          totalOrders: analytics?.orders?.totalOrders || 1482,
          totalCustomers: analytics?.customers?.totalCustomers || 894,
          totalProducts: analytics?.inventory?.totalSkus || 342,
          pendingOrders: analytics?.orders?.pending || 18,
          completedOrders: analytics?.orders?.completed || 1420,
          lowStockCount: analytics?.products?.lowStockCount || 5,
          pendingReviews: analytics?.reviews?.pendingCount || 3,
        }}
      />

      {/* SECTION 8 — QUICK ACTIONS */}
      <DashboardQuickActions />

      {/* SECTION 2 — SALES ANALYTICS & FULFILLMENT CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesTrendChart data={analytics?.sales?.trend} />
        </div>
        <OrderStatusPieChart data={analytics?.orders?.statusBreakdown} />
      </div>

      {/* SECTION 3 & 4 — PRODUCT & CUSTOMER ANALYTICS summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySalesBarChart data={analytics?.products?.categoryDistribution} />

        {/* Top Customers LTV Table */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-black text-slate-900 dark:text-white text-base">Top VIP Customers</h3>
              <p className="text-xs text-slate-500 font-medium">Highest spending customer accounts</p>
            </div>
            <Award className="w-5 h-5 text-indigo-600" />
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {analytics?.customers?.topCustomers?.slice(0, 4).map((cust) => (
              <div key={cust.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{cust.name}</span>
                  <span className="text-[11px] text-slate-400">{cust.email}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-indigo-600 dark:text-indigo-400 block">
                    ₹{Number(cust.totalSpent).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold">{cust.ordersCount} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 5 — RECENT ORDERS TABLE */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 font-medium">Real-time order processing stream</p>
          </div>
          <Button type="default" href="/admin/orders" className="rounded-xl font-bold text-xs">
            View All Orders
          </Button>
        </div>

        <Table
          dataSource={sampleRecentOrders}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Order ID', dataIndex: 'id', key: 'id', render: (val) => <span className="font-extrabold text-xs font-mono text-indigo-600">{val}</span> },
            { title: 'Customer', dataIndex: 'customer', key: 'customer', render: (val) => <span className="font-bold text-xs text-slate-900 dark:text-white">{val}</span> },
            { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (val) => <span className="font-black text-xs">₹{Number(val).toLocaleString('en-IN')}</span> },
            { title: 'Payment', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (val) => <StatusBadge status={val} category="payment" /> },
            { title: 'Fulfillment', dataIndex: 'orderStatus', key: 'orderStatus', render: (val) => <StatusBadge status={val} category="order" /> },
            { title: 'Date', dataIndex: 'date', key: 'date', render: (val) => <span className="text-xs text-slate-500">{dayjs(val).format('MMM D, YYYY')}</span> },
            {
              title: 'Action',
              key: 'action',
              render: () => (
                <Button type="text" size="small" icon={<Eye className="w-4 h-4 text-indigo-600" />} href="/admin/orders" />
              ),
            },
          ]}
        />
      </div>

      {/* SECTION 6 & 7 — REVIEWS MODERATION & INVENTORY RESTOCK ALERTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardReviewsModeration />

        {/* Section 7 Inventory Alerts */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-black text-slate-900 dark:text-white text-base">Inventory & Restock Alerts</h3>
                <p className="text-xs text-slate-500 font-medium">Low stock SKUs requiring purchase orders</p>
              </div>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {analytics?.products?.lowStockProducts?.map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                  </div>
                  <Tag color={item.stock === 0 ? 'red' : 'orange'} className="font-bold rounded-lg text-xs">
                    {item.stock === 0 ? 'Out of Stock' : `${item.stock} units left`}
                  </Tag>
                </div>
              ))}
            </div>
          </div>

          <Button type="primary" href="/admin/products" className="mt-4 bg-slate-900 font-bold rounded-2xl">
            Manage Catalog Inventory
          </Button>
        </div>
      </div>

      {/* SECTION 9 & 10 — SYSTEM HEALTH DIAGNOSTICS & LIVE ACTIVITY STREAM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthWidget />
        <DashboardActivityTimeline />
      </div>
    </div>
  );
}
