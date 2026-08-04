'use client';

import React, { useState } from 'react';
import { useCouponDetails, useCouponMutations, useCouponsList, useCouponStats } from '@/hooks/use-sales';
import { Coupon } from '@/types/sales.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Space,
  DatePicker,
  Dropdown,
  Switch,
  Drawer,
  Tag,
} from 'antd';
import {
  Ticket,
  Plus,
  Edit,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  MoreHorizontal,
  History,
  Eye,
  Percent,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminCouponsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [selectedCouponId, setSelectedCouponId] = useState<string | null>(null);
  const [isUsageDrawerOpen, setIsUsageDrawerOpen] = useState(false);

  const [form] = Form.useForm();

  const { data: statsData, isLoading: isStatsLoading } = useCouponStats();
  const { data: couponsData, isLoading: isCouponsLoading } = useCouponsList({
    search: search || undefined,
    status: statusFilter,
    type: typeFilter,
    page,
    limit,
  });

  const { data: couponDetails, isLoading: isDetailsLoading } = useCouponDetails(
    selectedCouponId || ''
  );

  const { createCoupon, updateCoupon, deleteCoupon } = useCouponMutations();

  const handleOpenModal = (coupon?: Coupon) => {
    if (coupon) {
      setEditingCoupon(coupon);
      form.setFieldsValue({
        code: coupon.code,
        title: coupon.title,
        description: coupon.description,
        type: coupon.type,
        value: Number(coupon.value),
        minimumOrderAmount: coupon.minimumOrderAmount ? Number(coupon.minimumOrderAmount) : undefined,
        maximumDiscount: coupon.maximumDiscount ? Number(coupon.maximumDiscount) : undefined,
        usageLimit: coupon.usageLimit,
        startDate: dayjs(coupon.startDate),
        endDate: dayjs(coupon.endDate),
        status: coupon.status,
      });
    } else {
      setEditingCoupon(null);
      form.resetFields();
      form.setFieldsValue({
        type: 'PERCENTAGE',
        status: 'ACTIVE',
        startDate: dayjs(),
        endDate: dayjs().add(30, 'day'),
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : new Date().toISOString(),
      endDate: values.endDate ? values.endDate.toISOString() : new Date().toISOString(),
    };

    if (editingCoupon) {
      await updateCoupon.mutateAsync({ id: editingCoupon.id, data: payload });
    } else {
      await createCoupon.mutateAsync(payload);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleToggleActive = (coupon: Coupon) => {
    const newStatus = coupon.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateCoupon.mutate({ id: coupon.id, data: { status: newStatus } });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Coupon',
      content: 'Are you sure you want to delete this coupon code?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteCoupon.mutate(id),
    });
  };

  const handleViewUsages = (id: string) => {
    setSelectedCouponId(id);
    setIsUsageDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Coupon Code & Title',
      dataIndex: 'code',
      key: 'code',
      render: (code: string, record: Coupon) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <span className="font-mono font-extrabold text-slate-900 dark:text-white block text-sm">
              {code}
            </span>
            <span className="text-xs text-slate-500 font-medium">{record.title}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Discount',
      dataIndex: 'value',
      key: 'value',
      render: (value: number, record: Coupon) => (
        <span className="font-black text-slate-900 dark:text-white text-sm">
          {record.type === 'PERCENTAGE'
            ? `${value}% OFF`
            : record.type === 'FREE_SHIPPING'
            ? 'FREE SHIPPING'
            : `₹${Number(value).toLocaleString('en-IN')} FLAT`}
        </span>
      ),
    },
    {
      title: 'Min Spend',
      dataIndex: 'minimumOrderAmount',
      key: 'minimumOrderAmount',
      render: (min: number | null) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">
          {min ? `₹${Number(min).toLocaleString('en-IN')}` : 'No Minimum'}
        </span>
      ),
    },
    {
      title: 'Usage Ratio',
      dataIndex: 'usedCount',
      key: 'usedCount',
      render: (used: number, record: Coupon) => (
        <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
          {used} / {record.usageLimit || '∞'}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Coupon) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={status} category="coupon" />
          <Switch
            size="small"
            checked={status === 'ACTIVE'}
            onChange={() => handleToggleActive(record)}
          />
        </div>
      ),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string) => (
        <span className="text-xs text-slate-500">{dayjs(date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Coupon) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'edit',
                icon: <Edit className="w-4 h-4 text-indigo-600" />,
                label: 'Edit Coupon',
                onClick: () => handleOpenModal(record),
              },
              {
                key: 'history',
                icon: <History className="w-4 h-4 text-emerald-600" />,
                label: 'View Usage History',
                onClick: () => handleViewUsages(record.id),
              },
              { type: 'divider' },
              {
                key: 'delete',
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                label: 'Delete Coupon',
                onClick: () => handleDelete(record.id),
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
            <Ticket className="w-4 h-4" />
            <span>Promotions & Discounts</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Coupon Management</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
        >
          Create Coupon
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesStatCard
          title="Total Coupons"
          value={statsData?.totalCoupons || 0}
          icon={Ticket}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Active Promotions"
          value={statsData?.activeCoupons || 0}
          icon={CheckCircle}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Expired Vouchers"
          value={statsData?.expiredCoupons || 0}
          icon={Clock}
          colorScheme="amber"
        />
        <SalesStatCard
          title="Total Discount Issued"
          value={`₹${(statsData?.totalDiscountIssued || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          colorScheme="purple"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search coupon code or promotion title..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Discount Type"
          value={typeFilter}
          onChange={(val) => setTypeFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
          <Select.Option value="FIXED_AMOUNT">Fixed Amount (₹)</Select.Option>
          <Select.Option value="FREE_SHIPPING">Free Shipping</Select.Option>
        </Select>

        <Select
          placeholder="Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="ACTIVE">Active</Select.Option>
          <Select.Option value="INACTIVE">Inactive</Select.Option>
          <Select.Option value="EXPIRED">Expired</Select.Option>
        </Select>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={couponsData?.coupons || []}
          columns={columns}
          rowKey="id"
          loading={isCouponsLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: couponsData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Create / Edit Coupon Modal */}
      <Modal
        title={editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createCoupon.isPending || updateCoupon.isPending}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="code"
              label="Coupon Code"
              rules={[{ required: true, message: 'Code is required' }]}
            >
              <Input placeholder="e.g. LUXURY20" className="uppercase font-mono font-bold" />
            </Form.Item>

            <Form.Item
              name="type"
              label="Discount Type"
              rules={[{ required: true, message: 'Type is required' }]}
            >
              <Select>
                <Select.Option value="PERCENTAGE">Percentage (%)</Select.Option>
                <Select.Option value="FIXED_AMOUNT">Fixed Amount (₹)</Select.Option>
                <Select.Option value="FREE_SHIPPING">Free Shipping</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="title"
            label="Promotion Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="e.g. 20% Off Festive Couture Collection" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="value"
              label="Discount Value"
              rules={[{ required: true, message: 'Value is required' }]}
            >
              <InputNumber min={0} precision={2} className="w-full" placeholder="Value (% or ₹)" />
            </Form.Item>

            <Form.Item name="minimumOrderAmount" label="Minimum Order Spend (₹)">
              <InputNumber min={0} precision={2} className="w-full" placeholder="Optional" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="maximumDiscount" label="Maximum Discount Cap (₹)">
              <InputNumber min={0} precision={2} className="w-full" placeholder="For % coupons" />
            </Form.Item>

            <Form.Item name="usageLimit" label="Total Usage Limit">
              <InputNumber min={1} className="w-full" placeholder="Unlimited if blank" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[{ required: true, message: 'Start date is required' }]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>

            <Form.Item
              name="endDate"
              label="Expiry Date"
              rules={[{ required: true, message: 'Expiry date is required' }]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Internal details or terms & conditions..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Usage History Drawer */}
      <Drawer
        title={
          couponDetails ? (
            <div className="flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              <span className="font-mono font-black text-slate-900 dark:text-white">
                {couponDetails.code} — Usage History
              </span>
            </div>
          ) : (
            'Usage History'
          )
        }
        placement="right"
        size={540}
        onClose={() => setIsUsageDrawerOpen(false)}
        open={isUsageDrawerOpen}
        loading={isDetailsLoading}
      >
        {couponDetails && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex justify-between">
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Total Redemptions</span>
                <span className="text-lg font-black text-slate-900 dark:text-white block">
                  {couponDetails.usages?.length || 0} times
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold uppercase text-[10px]">Discount Value</span>
                <span className="text-lg font-black text-slate-900 dark:text-white block">
                  {couponDetails.type === 'PERCENTAGE'
                    ? `${couponDetails.value}%`
                    : `₹${Number(couponDetails.value).toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>

            <h4 className="font-black text-slate-900 dark:text-white text-sm">Customer Redemptions</h4>
            <div className="space-y-3">
              {couponDetails.usages && couponDetails.usages.length > 0 ? (
                couponDetails.usages.map((usage) => (
                  <div
                    key={usage.id}
                    className="p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        {usage.user?.fullName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        Order #{usage.order?.orderNumber}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-emerald-600 block">
                        - ₹{Number(usage.discount).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {dayjs(usage.usedAt).format('MMM D, YYYY')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-8">No usage recorded for this coupon code yet.</p>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
