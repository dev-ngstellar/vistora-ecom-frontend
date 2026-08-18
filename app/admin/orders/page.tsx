'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrderMutations, useOrders, useOrderStats } from '@/hooks/use-sales';
import { Order } from '@/types/sales.types';
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
  Avatar,
} from 'antd';
import {
  Search,
  Download,
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
  Boxes,
  TrendingUp,
} from 'lucide-react';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import { TableToolbar } from '@/components/admin/table-toolbar';

const { RangePicker } = DatePicker;

const getRetailerDetails = (item: any) => {
  const brandName = item.product?.brand?.name || '';
  const productName = item.productName.toLowerCase();

  let name = 'Vistora Retailer Partner';
  let address = item.product?.brand?.address || 'Vistora HQ, Plot 12, HSR Layout, Bengaluru, Karnataka - 560102';

  if (brandName.toLowerCase().includes('luxe') || productName.includes('lakme') || productName.includes('powerplay')) {
    name = 'Vistora Luxe Cosmetics';
    if (!item.product?.brand?.address) {
      address = 'Vistora Luxe Chambers, 3rd Floor, Brigade Road, Bengaluru, Karnataka - 560001';
    }
  } else if (brandName.toLowerCase().includes('vnatura') || productName.includes('eyetex') || productName.includes('kajal') || productName.includes('bbloom')) {
    name = 'Bbloom VNatura';
    if (!item.product?.brand?.address) {
      address = 'Auroville Nature Care, 18, Temple Road, Auroville, Pondicherry - 605101';
    }
  } else if (brandName.toLowerCase().includes('mst') || productName.includes('mst') || productName.includes('saree') || productName.includes('handloom')) {
    name = 'MST / MTS Handlooms';
    if (!item.product?.brand?.address) {
      address = 'MST Handloom Chambers, 45, Nethaji Road, Coimbatore, Tamil Nadu - 641001';
    }
  } else if (brandName) {
    name = brandName;
    if (!item.product?.brand?.address) {
      address = `${brandName} Hub, Industrial Area Phase II, Chennai, Tamil Nadu - 600001`;
    }
  }

  return { name, address };
};

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

  const searchParams = useSearchParams();
  const invoiceParam = searchParams?.get('invoice') || searchParams?.get('orderId');

  useEffect(() => {
    if (invoiceParam && ordersData?.orders?.length) {
      const matched = ordersData.orders.find(
        (o) => o.id === invoiceParam || o.orderNumber === invoiceParam
      );
      if (matched) {
        setSelectedOrder(matched);
        setIsInvoiceOpen(true);
      }
    }
  }, [invoiceParam, ordersData]);

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
          Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
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

  // Calculate high-level order counts
  const ordersList = ordersData?.orders || [];
  const totalOrdersCount = ordersData?.meta?.total || ordersList.length;
  const pendingOrdersCount = ordersList.filter((o) =>
    ['PENDING', 'PROCESSING', 'CONFIRMED', 'PACKED'].includes(o.status)
  ).length;
  const deliveredOrdersCount = ordersList.filter((o) => o.status === 'DELIVERED').length;
  const totalRevenueSum = ordersList.reduce((acc, o) => acc + (Number(o.total) || 0), 0);

  const columns = [
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string, record: Order) => (
        <button
          onClick={() => handleOpenDetails(record)}
          className="font-mono font-extrabold text-[#A50025] hover:underline text-left block"
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
          <Avatar className="bg-[#0F172A] text-white font-bold shrink-0">
            {record.user?.firstName?.[0] || 'C'}
          </Avatar>
          <div>
            <span className="font-bold text-[#111827] block text-xs">
              {record.user?.fullName || 'Guest Customer'}
            </span>
            <span className="text-[11px] text-[#64748B] font-medium block">{record.user?.email || '—'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <span className="text-xs font-semibold text-[#111827] bg-[#F7F8FA] border border-[#E5E7EB] px-2.5 py-1 rounded-full">
          {items?.length || 0} item(s)
        </span>
      ),
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <span className="font-black text-[#111827] text-sm">
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
        <span className="text-xs text-[#64748B] font-medium">
          {dayjs(date).format('MMM D, YYYY')}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Order) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Eye className="w-4 h-4 text-[#A50025]" />}
            title="View Invoice"
            onClick={() => {
              setSelectedOrder(record);
              setIsInvoiceOpen(true);
            }}
          />
          <Dropdown
            menu={{
              items: [
                {
                  key: 'invoice',
                  icon: <FileText className="w-4 h-4 text-[#A50025]" />,
                  label: 'View Invoice',
                  onClick: () => {
                    setSelectedOrder(record);
                    setIsInvoiceOpen(true);
                  },
                },
                {
                  key: 'view',
                  icon: <ShoppingBag className="w-4 h-4 text-indigo-600" />,
                  label: 'View Order Details',
                  onClick: () => handleOpenDetails(record),
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
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Top Order KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Total Orders
            </span>
            <h3 className="text-xl font-black text-[#111827] mt-0.5">
              {totalOrdersCount}
            </h3>
            <span className="text-[10px] text-[#64748B] font-semibold block">
              All time purchases
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF0F3] border border-[#A50025]/20 flex items-center justify-center text-[#A50025] shrink-0">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Pending Dispatch
            </span>
            <h3 className="text-xl font-black text-[#111827] mt-0.5">
              {pendingOrdersCount}
            </h3>
            <span className="text-[10px] text-amber-600 font-semibold block">
              Awaiting retailer dispatch
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Delivered Orders
            </span>
            <h3 className="text-xl font-black text-[#111827] mt-0.5">
              {deliveredOrdersCount}
            </h3>
            <span className="text-[10px] text-emerald-600 font-semibold block">
              Successfully fulfilled
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
              Order Value (Page)
            </span>
            <h3 className="text-xl font-black text-[#111827] mt-0.5">
              ₹{Number(totalRevenueSum).toLocaleString('en-IN')}
            </h3>
            <span className="text-[10px] text-blue-600 font-semibold block">
              Current view gross total
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Page Header */}
      <PageHeader
        title="Orders & Retailer Fulfillment"
        subtitle="Manage customer purchases, multi-retailer partner fulfillment, and dispatch statuses."
        action={
          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
            className="rounded-lg font-bold text-xs bg-[#A50025] hover:bg-[#7D001C] text-white h-9 px-4"
          >
            Export Orders
          </Button>
        }
        toolbar={
          <TableToolbar
            searchValue={search}
            onSearchChange={(val) => setSearch(val)}
            searchPlaceholder="Search order #, customer name, email..."
            onReset={() => {
              setSearch('');
              setStatusFilter(undefined);
              setPaymentFilter(undefined);
              setDateRange(undefined);
            }}
            filters={
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  placeholder="Order Status"
                  value={statusFilter}
                  onChange={(val) => setStatusFilter(val)}
                  className="w-36 text-xs"
                  allowClear
                >
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="CONFIRMED">Confirmed</Select.Option>
                  <Select.Option value="PROCESSING">Processing</Select.Option>
                  <Select.Option value="PACKED">Packed</Select.Option>
                  <Select.Option value="SHIPPED">Shipped</Select.Option>
                  <Select.Option value="OUT_FOR_DELIVERY">Out for Delivery</Select.Option>
                  <Select.Option value="DELIVERED">Delivered</Select.Option>
                  <Select.Option value="CANCELLED">Cancelled</Select.Option>
                </Select>

                <Select
                  placeholder="Payment Status"
                  value={paymentFilter}
                  onChange={(val) => setPaymentFilter(val)}
                  className="w-36 text-xs"
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
                  className="rounded-lg text-xs"
                />
              </div>
            }
          />
        }
      />

      {/* Orders Data Table */}
      <AdminCard headerBorder={false} className="p-0">
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
      </AdminCard>

      {/* Order Details Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#A50025]" />
              <span className="font-black text-[#111827]">
                Order #{selectedOrder.orderNumber}
              </span>
            </div>
          ) : (
            'Order Details'
          )
        }
        placement="right"
        styles={{ wrapper: { width: '640px', maxWidth: '100vw' } }}
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        extra={
          selectedOrder && (
            <Space>
              <Button
                icon={<FileText className="w-4 h-4" />}
                onClick={() => setIsInvoiceOpen(true)}
                className="rounded-lg font-bold text-xs"
              >
                Invoice
              </Button>
              <Button
                type="primary"
                onClick={() => handleOpenStatusModal(selectedOrder)}
                className="bg-[#A50025] hover:bg-[#7D001C] rounded-lg font-bold text-xs text-white"
              >
                Update Status
              </Button>
            </Space>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            {/* Status Highlights */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-[#F7F8FA] rounded-xl border border-[#E5E7EB]">
              <div>
                <span className="text-[#64748B] font-semibold uppercase tracking-wider block text-[10px]">Current Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} category="order" />
                </div>
              </div>

              <div>
                <span className="text-[#64748B] font-semibold uppercase tracking-wider block text-[10px]">Payment Status</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.payments?.[0]?.status || 'PENDING'} category="payment" />
                </div>
              </div>

              <div>
                <span className="text-[#64748B] font-semibold uppercase tracking-wider block text-[10px]">Total Order Amount</span>
                <span className="text-base font-black text-[#111827] mt-1 block">
                  ₹{Number(selectedOrder.total).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Customer & Address Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#F7F8FA] p-3.5 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#A50025] font-bold mb-2">
                  <User className="w-4 h-4" />
                  <span>Customer Details</span>
                </div>
                <p className="font-bold text-[#111827]">{selectedOrder.user?.fullName || 'Guest Customer'}</p>
                <p className="text-[#64748B] font-medium">{selectedOrder.user?.email || '—'}</p>
                <p className="text-[#64748B] font-medium">{selectedOrder.user?.phone || 'No phone provided'}</p>
              </div>

              <div className="bg-[#F7F8FA] p-3.5 rounded-xl border border-[#E5E7EB]">
                <div className="flex items-center gap-1.5 text-[#A50025] font-bold mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Shipping Address</span>
                </div>
                <p className="font-bold text-[#111827]">{selectedOrder.address?.fullName || 'Same as Customer'}</p>
                <p className="text-[#64748B]">{selectedOrder.address?.addressLine1 || 'No address line 1'}</p>
                <p className="text-[#64748B]">
                  {selectedOrder.address?.city}, {selectedOrder.address?.state} - {selectedOrder.address?.postalCode}
                </p>
              </div>
            </div>

            {/* Multi-Retailer Order Fulfillment Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-[#111827] text-xs uppercase tracking-wider">
                  Item Fulfillment & Partner Ownership
                </h4>
                <span className="text-[10px] font-bold text-[#A50025] bg-[#FFF0F3] px-2 py-0.5 rounded-full border border-[#A50025]/20">
                  Vistora Enterprise Admin View Only
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedOrder.items.map((item) => {
                  const retailer = getRetailerDetails(item);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-white rounded-xl border border-[#E5E7EB] shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.product?.images?.[0]?.imageUrl ? (
                            <img
                              src={item.product.images[0].imageUrl}
                              alt={item.productName}
                              className="w-10 h-10 rounded-lg object-cover border border-[#E5E7EB] shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-[#F7F8FA] border border-[#E5E7EB] flex items-center justify-center font-bold text-[#64748B] shrink-0">
                              📦
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-[#111827] block text-xs">{item.productName}</span>
                            <span className="text-[11px] text-[#64748B] font-mono">SKU: {item.sku}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-[#111827] block">
                            ₹{Number(item.total).toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-[#64748B]">
                            {item.quantity} × ₹{Number(item.unitPrice).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Retailer Partner Confidential Ownership Tag & Address */}
                      <div className="pt-2 border-t border-[#F3F4F6] space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-[#FFF0F3] text-[#A50025] font-bold border border-[#A50025]/20">
                              Retailer Partner: {retailer.name}
                            </span>
                          </div>
                          <span className="text-[#16A34A] font-bold">
                            Pending Retailer Dispatch
                          </span>
                        </div>
                        <div className="text-[#64748B] font-medium pl-0.5 flex flex-wrap items-center gap-x-1.5">
                          <span className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 dark:text-slate-500">Retailer Address:</span>
                          <span className="text-slate-700 font-semibold">{retailer.address}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Timeline */}
            <div>
              <h4 className="font-extrabold text-[#111827] text-xs uppercase tracking-wider mb-2">Status Timeline</h4>
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
