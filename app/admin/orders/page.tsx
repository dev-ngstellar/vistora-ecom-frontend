'use client';

import React, { useState } from 'react';
import { useOrderMutations, useOrders, useOrderStats } from '@/hooks/use-sales';
import { Order, OrderStatus } from '@/types/sales.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { StatusBadge } from '@/components/sales/status-badge';
import { OrderTimeline } from '@/components/sales/order-timeline';
import { InvoiceModal } from '@/components/sales/invoice-modal';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Space,
  Form,
  Dropdown,
  DatePicker,
  Tag,
  Avatar,
} from 'antd';
import {
  Search,
  Download,
  Filter,
  Eye,
  ShoppingBag,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  MoreHorizontal,
  FileText,
  Ban,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

export default function AdminOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [paymentFilter, setPaymentFilter] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[string, string] | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [statusForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  const { data: statsData, isLoading: isStatsLoading } = useOrderStats();
  const { data: ordersData, isLoading: isOrdersLoading } = useOrders({
    search: search || undefined,
    status: statusFilter,
    paymentStatus: paymentFilter,
    startDate: dateRange ? dateRange[0] : undefined,
    endDate: dateRange ? dateRange[1] : undefined,
    page,
    limit,
  });

  const { updateStatus, cancelOrder } = useOrderMutations();

  const handleOpenDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDrawerOpen(true);
  };

  const handleOpenStatusModal = (order: Order) => {
    setSelectedOrder(order);
    statusForm.setFieldsValue({ status: order.status, remarks: '' });
    setIsStatusModalOpen(true);
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrder(order);
    cancelForm.resetFields();
    setIsCancelModalOpen(true);
  };

  const handleStatusSubmit = async (values: any) => {
    if (!selectedOrder) return;
    await updateStatus.mutateAsync({
      id: selectedOrder.id,
      status: values.status,
      remarks: values.remarks,
    });
    setIsStatusModalOpen(false);
    setIsDetailDrawerOpen(false);
  };

  const handleCancelSubmit = async (values: any) => {
    if (!selectedOrder) return;
    await cancelOrder.mutateAsync({
      id: selectedOrder.id,
      reason: values.reason,
    });
    setIsCancelModalOpen(false);
    setIsDetailDrawerOpen(false);
  };

  const handleExportCsv = async () => {
    try {
      const response = await fetch('/api/v1/orders/export', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${dayjs().format('YYYY-MM-DD')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export CSV', error);
    }
  };

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <button
          onClick={() => handleOpenDetails(record)}
          className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 hover:underline text-left block"
        >
          #{text}
        </button>
      ),
    },
    {
      title: 'Customer',
      dataIndex: 'user',
      key: 'user',
      render: (_: any, record: Order) => (
        <div className="flex items-center gap-2.5">
          <Avatar className="bg-slate-900 text-white font-bold">
            {record.user?.firstName?.[0] || 'C'}
          </Avatar>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              {record.user?.fullName || 'Guest Customer'}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">{record.user?.email}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {items?.length || 0} item(s)
        </span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-black text-slate-900 dark:text-white text-sm">
          ₹{Number(total).toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Payment Status',
      dataIndex: 'payments',
      key: 'payments',
      render: (payments: any[]) => (
        <StatusBadge status={payments?.[0]?.status || 'PENDING'} category="payment" />
      ),
    },
    {
      title: 'Order Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} category="order" />,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-slate-500 font-medium">
          {dayjs(date).format('MMM D, YYYY')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'view',
                icon: <Eye className="w-4 h-4 text-indigo-600" />,
                label: 'View Details',
                onClick: () => handleOpenDetails(record),
              },
              {
                key: 'invoice',
                icon: <FileText className="w-4 h-4 text-emerald-600" />,
                label: 'View Invoice',
                onClick: () => {
                  setSelectedOrder(record);
                  setIsInvoiceOpen(true);
                },
              },
              {
                key: 'update_status',
                icon: <Clock className="w-4 h-4 text-amber-600" />,
                label: 'Update Status',
                onClick: () => handleOpenStatusModal(record),
              },
              {
                type: 'divider',
              },
              {
                key: 'cancel',
                danger: true,
                disabled: record.status === 'CANCELLED' || record.status === 'DELIVERED',
                icon: <Ban className="w-4 h-4" />,
                label: 'Cancel Order',
                onClick: () => handleOpenCancelModal(record),
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
            <ShoppingBag className="w-4 h-4" />
            <span>Sales & Order Fulfillment</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Order Management</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="default"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
            className="rounded-2xl font-bold border-slate-300 dark:border-slate-700"
          >
            Export Orders
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesStatCard
          title="Total Orders"
          value={statsData?.totalOrders || 0}
          icon={ShoppingBag}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Pending Fulfillment"
          value={statsData?.pendingOrders || 0}
          icon={Clock}
          colorScheme="amber"
        />
        <SalesStatCard
          title="Completed Orders"
          value={statsData?.completedOrders || 0}
          icon={CheckCircle}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Total Sales Revenue"
          value={`₹${(statsData?.totalRevenue || 0).toLocaleString('en-IN')}`}
          icon={DollarSign}
          colorScheme="purple"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by Order #, Customer name or email..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Order Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="CONFIRMED">Confirmed</Select.Option>
          <Select.Option value="PROCESSING">Processing</Select.Option>
          <Select.Option value="SHIPPED">Shipped</Select.Option>
          <Select.Option value="DELIVERED">Delivered</Select.Option>
          <Select.Option value="CANCELLED">Cancelled</Select.Option>
        </Select>

        <Select
          placeholder="Payment Status"
          value={paymentFilter}
          onChange={(val) => setPaymentFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="PAID">Paid</Select.Option>
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="FAILED">Failed</Select.Option>
          <Select.Option value="REFUNDED">Refunded</Select.Option>
        </Select>

        <RangePicker
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              setDateRange([dates[0].toISOString(), dates[1].toISOString()]);
            } else {
              setDateRange(undefined);
            }
          }}
          className="rounded-2xl"
        />
      </div>

      {/* Orders Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={ordersData?.orders || []}
          columns={columns}
          rowKey="id"
          loading={isOrdersLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: ordersData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Order Details Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
              <span className="font-black text-slate-900 dark:text-white">
                Order #{selectedOrder.orderNumber}
              </span>
            </div>
          ) : (
            'Order Details'
          )
        }
        placement="right"
        size={640}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        extra={
          selectedOrder && (
            <Space>
              <Button
                icon={<FileText className="w-4 h-4" />}
                onClick={() => setIsInvoiceOpen(true)}
                className="rounded-xl font-bold"
              >
                Invoice
              </Button>
              <Button
                type="primary"
                onClick={() => handleOpenStatusModal(selectedOrder)}
                className="bg-slate-900 rounded-xl font-bold"
              >
                Update Status
              </Button>
            </Space>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Status Highlights */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} category="order" />
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Payment</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.payments?.[0]?.status || 'PENDING'} category="payment" />
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-semibold uppercase tracking-wider block text-[10px]">Total Paid</span>
                <span className="text-base font-black text-slate-900 dark:text-white mt-1 block">
                  ₹{Number(selectedOrder.total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer & Address Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                  <User className="w-4 h-4" />
                  <span>Customer Info</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.user?.fullName}</p>
                <p className="text-slate-500 font-medium">{selectedOrder.user?.email}</p>
                <p className="text-slate-500 font-medium">{selectedOrder.user?.phone || 'No phone provided'}</p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <p className="font-bold text-slate-900 dark:text-white">{selectedOrder.address?.fullName}</p>
                <p className="text-slate-600">{selectedOrder.address?.addressLine1}</p>
                <p className="text-slate-600">
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.postalCode}
                </p>
              </div>
            </div>

            {/* Products Purchased */}
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm mb-3">Products Purchased</h4>
              <div className="space-y-3">
                {selectedOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                        📦
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{item.productName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">SKU: {item.sku}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-black text-slate-900 dark:text-white block">
                        ₹{Number(item.total).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h4 className="font-black text-slate-900 dark:text-white text-sm mb-3">Status Timeline</h4>
              <OrderTimeline history={selectedOrder.statusHistory} />
            </div>
          </div>
        )}
      </Drawer>

      {/* Invoice Modal */}
      <InvoiceModal
        order={selectedOrder}
        open={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
      />

      {/* Status Update Modal */}
      <Modal
        title="Update Order Status"
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        onOk={() => statusForm.submit()}
        confirmLoading={updateStatus.isPending}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleStatusSubmit} className="mt-4">
          <Form.Item name="status" label="New Order Status" rules={[{ required: true }]}>
            <Select>
              <Select.Option value="PENDING">Pending</Select.Option>
              <Select.Option value="CONFIRMED">Confirmed</Select.Option>
              <Select.Option value="PROCESSING">Processing</Select.Option>
              <Select.Option value="PACKED">Packed</Select.Option>
              <Select.Option value="SHIPPED">Shipped</Select.Option>
              <Select.Option value="OUT_FOR_DELIVERY">Out for Delivery</Select.Option>
              <Select.Option value="DELIVERED">Delivered</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="remarks" label="Remarks / Tracking Info">
            <Input.TextArea rows={3} placeholder="Provide notes or courier tracking updates..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Cancel Order Modal */}
      <Modal
        title="Cancel Order"
        open={isCancelModalOpen}
        onCancel={() => setIsCancelModalOpen(false)}
        onOk={() => cancelForm.submit()}
        confirmLoading={cancelOrder.isPending}
        okText="Confirm Cancel"
        okType="danger"
      >
        <Form form={cancelForm} layout="vertical" onFinish={handleCancelSubmit} className="mt-4">
          <Form.Item name="reason" label="Cancellation Reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Reason for order cancellation..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
