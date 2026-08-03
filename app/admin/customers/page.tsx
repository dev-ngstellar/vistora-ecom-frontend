'use client';

import React, { useState } from 'react';
import { useCustomerDetails, useCustomerMutations, useCustomers, useCustomerStats } from '@/hooks/use-sales';
import { Customer } from '@/types/sales.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Button,
  Input,
  Select,
  Drawer,
  Tabs,
  Avatar,
  Tag,
  Dropdown,
  Modal,
  Space,
} from 'antd';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  DollarSign,
  Eye,
  MoreHorizontal,
  MapPin,
  ShoppingBag,
  Heart,
  Activity,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminCustomersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: statsData, isLoading: isStatsLoading } = useCustomerStats();
  const { data: customersData, isLoading: isCustomersLoading } = useCustomers({
    search: search || undefined,
    status: statusFilter,
    page,
    limit,
  });

  const { data: customerDetails, isLoading: isDetailsLoading } = useCustomerDetails(
    selectedCustomerId || ''
  );

  const { updateStatus } = useCustomerMutations();

  const handleOpenDetails = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsDrawerOpen(true);
  };

  const handleToggleStatus = (customer: Customer) => {
    const newStatus = customer.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    Modal.confirm({
      title: `${newStatus === 'ACTIVE' ? 'Activate' : 'Suspend'} Customer Account?`,
      content: `Are you sure you want to change status of ${customer.fullName} to ${newStatus}?`,
      okText: 'Yes, Confirm',
      okType: newStatus === 'SUSPENDED' ? 'danger' : 'primary',
      onOk: () => updateStatus.mutate({ id: customer.id, status: newStatus }),
    });
  };

  const columns = [
    {
      title: 'Customer Name & Email',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (_: any, record: Customer) => (
        <div className="flex items-center gap-3">
          <Avatar className="bg-indigo-600 font-bold text-white uppercase">
            {record.firstName[0]}
          </Avatar>
          <div>
            <button
              onClick={() => handleOpenDetails(record.id)}
              className="font-bold text-slate-900 dark:text-white hover:underline text-left block text-xs"
            >
              {record.fullName}
            </button>
            <span className="text-[11px] text-slate-500 font-medium">{record.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone: string | null) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
          {phone || 'N/A'}
        </span>
      ),
    },
    {
      title: 'Account Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} category="account" />,
    },
    {
      title: 'Total Orders',
      dataIndex: 'totalOrders',
      key: 'totalOrders',
      render: (orders: number) => (
        <span className="text-xs font-bold text-slate-900 dark:text-white">{orders} order(s)</span>
      ),
    },
    {
      title: 'Total Spending',
      dataIndex: 'totalSpending',
      key: 'totalSpending',
      render: (total: number) => (
        <span className="font-black text-slate-900 dark:text-white text-sm">
          ₹{Number(total).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Last Order Date',
      dataIndex: 'lastOrderDate',
      key: 'lastOrderDate',
      render: (date: string | null) => (
        <span className="text-xs text-slate-500">
          {date ? dayjs(date).format('MMM D, YYYY') : 'Never'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Customer) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'details',
                icon: <Eye className="w-4 h-4 text-indigo-600" />,
                label: 'View Customer Details',
                onClick: () => handleOpenDetails(record.id),
              },
              {
                type: 'divider',
              },
              {
                key: 'toggle_status',
                icon:
                  record.status === 'ACTIVE' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  ),
                label: record.status === 'ACTIVE' ? 'Suspend Account' : 'Activate Account',
                onClick: () => handleToggleStatus(record),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreHorizontal className="w-4 h-4" />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Customer Relationship Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Customer Directory</h1>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesStatCard
          title="Total Customers"
          value={statsData?.totalCustomers || 0}
          icon={Users}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Active Accounts"
          value={statsData?.activeCustomers || 0}
          icon={UserCheck}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Suspended Customers"
          value={statsData?.suspendedCustomers || 0}
          icon={UserX}
          colorScheme="rose"
        />
        <SalesStatCard
          title="Customer Lifetime Value"
          value={`₹${(statsData?.totalCustomerSpending || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          colorScheme="purple"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by customer name, email or phone..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Account Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="ACTIVE">Active</Select.Option>
          <Select.Option value="SUSPENDED">Suspended</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
        </Select>
      </div>

      {/* Customers Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={customersData?.customers || []}
          columns={columns}
          rowKey="id"
          loading={isCustomersLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: customersData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Customer Details Drawer */}
      <Drawer
        title={
          customerDetails?.user ? (
            <div className="flex items-center gap-3">
              <Avatar className="bg-indigo-600 text-white font-bold">
                {customerDetails.user.firstName[0]}
              </Avatar>
              <div>
                <span className="font-black text-slate-900 dark:text-white block text-sm">
                  {customerDetails.user.fullName}
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  {customerDetails.user.email}
                </span>
              </div>
            </div>
          ) : (
            'Customer Profile'
          )
        }
        placement="right"
        width={680}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        loading={isDetailsLoading}
      >
        {customerDetails && (
          <Tabs
            defaultActiveKey="overview"
            items={[
              {
                key: 'overview',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <Users className="w-4 h-4" /> Profile
                  </span>
                ),
                children: (
                  <div className="space-y-6 pt-2 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Orders</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
                          {customerDetails.stats.totalOrders}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <span className="text-slate-400 font-semibold uppercase text-[10px]">Lifetime Spend</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
                          ₹{customerDetails.stats.totalSpending.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 text-center">
                        <span className="text-slate-400 font-semibold uppercase text-[10px]">Saved Addresses</span>
                        <span className="text-lg font-black text-slate-900 dark:text-white block mt-1">
                          {customerDetails.stats.addressCount}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Account Meta</h4>
                      <p>
                        <span className="text-slate-400">Account Status: </span>
                        <StatusBadge status={customerDetails.user.status} category="account" />
                      </p>
                      <p>
                        <span className="text-slate-400">Registered Date: </span>
                        <span className="font-semibold">{dayjs(customerDetails.user.createdAt).format('MMMM D, YYYY')}</span>
                      </p>
                      <p>
                        <span className="text-slate-400">Last Active: </span>
                        <span className="font-semibold">
                          {customerDetails.user.lastLoginAt ? dayjs(customerDetails.user.lastLoginAt).format('MMM D, YYYY • h:mm A') : 'Never'}
                        </span>
                      </p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'addresses',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <MapPin className="w-4 h-4" /> Addresses ({customerDetails.addresses.length})
                  </span>
                ),
                children: (
                  <div className="space-y-3 pt-2 text-xs">
                    {customerDetails.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 relative"
                      >
                        {addr.isDefault && (
                          <Tag color="blue" className="absolute top-4 right-4 rounded-md text-[10px]">
                            DEFAULT
                          </Tag>
                        )}
                        <span className="font-bold text-slate-900 dark:text-white text-sm block">{addr.fullName}</span>
                        <p className="text-slate-600 dark:text-slate-300 mt-1">{addr.addressLine1}</p>
                        {addr.addressLine2 && <p className="text-slate-600">{addr.addressLine2}</p>}
                        <p className="text-slate-600">
                          {addr.city}, {addr.state} - {addr.postalCode} ({addr.country})
                        </p>
                        <p className="text-slate-500 font-medium mt-1">Phone: {addr.phone}</p>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'orders',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <ShoppingBag className="w-4 h-4" /> Order History ({customerDetails.orders.length})
                  </span>
                ),
                children: (
                  <div className="space-y-3 pt-2 text-xs">
                    {customerDetails.orders.map((o) => (
                      <div
                        key={o.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 block text-xs">
                            #{o.orderNumber}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {dayjs(o.createdAt).format('MMM D, YYYY')} • {o.items.length} item(s)
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-slate-900 dark:text-white block text-sm">
                            ₹{Number(o.total).toLocaleString('en-IN')}
                          </span>
                          <StatusBadge status={o.status} category="order" />
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                key: 'wishlist',
                label: (
                  <span className="flex items-center gap-1.5 font-bold">
                    <Heart className="w-4 h-4" /> Wishlist ({customerDetails.wishlist.length})
                  </span>
                ),
                children: (
                  <div className="space-y-3 pt-2 text-xs">
                    {customerDetails.wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">👗</div>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{item.product?.name}</span>
                            <span className="text-slate-400 text-[11px]">₹{Number(item.product?.price).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </div>
  );
}
