'use client';

import React, { useState } from 'react';
import { useDashboardAnalytics } from '@/hooks/use-reports';
import { DashboardKPIGrid } from '@/components/dashboard/dashboard-kpi-grid';
import { SalesTrendChart } from '@/components/reports/sales-trend-chart';
import { OrderStatusPieChart } from '@/components/reports/order-status-pie-chart';
import { CategorySalesBarChart } from '@/components/reports/category-sales-bar-chart';
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions';
import { StatusBadge } from '@/components/sales/status-badge';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import {
  Table,
  Button,
  Select,
  DatePicker,
  Empty,
} from 'antd';
import {
  LayoutDashboard,
  Eye,
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

  const recentOrders = analytics?.orders?.recentOrders || [];

  return (
    <div className="space-y-5 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Dash board"
        subtitle="Welcome back! Here's what's happening with your store."
        action={
          <div className="flex items-center gap-2">
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
                className="rounded-lg text-xs"
              />
            )}
          </div>
        }
      />

      {/* KPI ROW — 6 COMPACT CARDS */}
      <DashboardKPIGrid
        metrics={{
          totalRevenue: analytics?.sales?.totalRevenue ?? 0,
          totalOrders: analytics?.orders?.totalOrders ?? 0,
          totalCustomers: analytics?.customers?.totalCustomers ?? 0,
          totalProducts: analytics?.inventory?.totalSkus ?? 0,
          pendingOrders: analytics?.orders?.pending ?? 0,
          completedOrders: analytics?.orders?.completed ?? 0,
          lowStockCount: analytics?.products?.lowStockCount ?? 0,
          pendingReviews: analytics?.reviews?.pendingCount ?? 0,
        }}
      />

      {/* QUICK EXECUTIVE ACTIONS */}
      <DashboardQuickActions />

      {/* ROW 2 — SALES OVERVIEW (60%) & ORDER FULFILLMENT STATUS (40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-7">
          <SalesTrendChart data={analytics?.sales?.trend} />
        </div>
        <div className="lg:col-span-5">
          <OrderStatusPieChart data={analytics?.orders?.statusBreakdown} />
        </div>
      </div>

      {/* ROW 3 — CATEGORY DISTRIBUTION (50%) & TOP VIP CUSTOMERS (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <CategorySalesBarChart data={analytics?.products?.categoryDistribution} />

        {/* Top VIP Customers Card */}
        <AdminCard
          title="Top VIP Customers"
          subtitle="Highest spending customer accounts"
          action={
            <Button type="default" href="/admin/customers" className="rounded-lg text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#A50025] dark:hover:text-[#A50025] hover:border-[#A50025] dark:hover:border-[#A50025]">
              View All Customers
            </Button>
          }
        >
          {(!analytics?.customers?.topCustomers || analytics.customers.topCustomers.length === 0) ? (
            <div className="py-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
              No customer purchase history available for selected period.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
              {analytics.customers.topCustomers.slice(0, 4).map((cust) => (
                <div key={cust.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{cust.name}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{cust.email}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-[#A50025] dark:text-rose-400 block">
                      ₹{Number(cust.totalSpent).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{cust.ordersCount} orders</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </AdminCard>
      </div>

      {/* ROW 4 — RECENT CUSTOMER ORDERS TABLE */}
      <AdminCard
        title="Recent Orders"
        subtitle="Latest customer purchases awaiting fulfillment"
        action={
          <Button type="default" href="/admin/orders" className="rounded-lg text-xs font-bold border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-[#A50025] dark:hover:text-[#A50025] hover:border-[#A50025] dark:hover:border-[#A50025]">
            View All Orders
          </Button>
        }
      >
        <Table
          dataSource={recentOrders}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No recent customer orders found in live database." /> }}
          columns={[
            { title: 'ORDER ID', dataIndex: 'id', key: 'id', render: (val) => <span className="font-extrabold text-xs font-mono text-[#A50025] dark:text-rose-400">{val}</span> },
            { title: 'CUSTOMER', dataIndex: 'customer', key: 'customer', render: (val) => <span className="font-bold text-xs text-slate-900 dark:text-slate-200">{val}</span> },
            { title: 'AMOUNT', dataIndex: 'amount', key: 'amount', render: (val) => <span className="font-black text-xs text-slate-900 dark:text-slate-100">₹{Number(val).toLocaleString('en-IN')}</span> },
            { title: 'PAYMENT', dataIndex: 'paymentStatus', key: 'paymentStatus', render: (val) => <StatusBadge status={val} category="payment" /> },
            { title: 'FULFILLMENT', dataIndex: 'orderStatus', key: 'orderStatus', render: (val) => <StatusBadge status={val} category="order" /> },
            { title: 'DATE', dataIndex: 'date', key: 'date', render: (val) => <span className="text-xs text-slate-500 dark:text-slate-400">{dayjs(val).format('MMM D, YYYY')}</span> },
            {
              title: 'ACTION',
              key: 'action',
              render: (_: any, record: any) => (
                <Button
                  type="text"
                  size="small"
                  icon={<Eye className="w-4 h-4 text-[#A50025] dark:text-rose-450" />}
                  title="View Invoice"
                  href={`/admin/orders?invoice=${record.id}`}
                />
              ),
            },
          ]}
        />
      </AdminCard>

    </div>
  );
}
