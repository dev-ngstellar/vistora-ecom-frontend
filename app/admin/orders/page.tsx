'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useOrderMutations, useOrders, useOrderStats } from '@/hooks/use-sales';
import { salesService } from '@/services/sales.service';
import { Order } from '@/types/sales.types';
import toast from 'react-hot-toast';
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
  Truck,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import dayjs from 'dayjs';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import { TableToolbar } from '@/components/admin/table-toolbar';

const { RangePicker } = DatePicker;

const COURIER_OPTIONS = [
  { label: 'The Professional Couriers', value: 'The Professional Couriers', defaultUrl: 'https://www.tpcindia.com' },
  { label: 'ST Courier', value: 'ST Courier', defaultUrl: 'https://stcourier.com' },
  { label: 'India Post / Speed Post', value: 'India Post', defaultUrl: 'https://www.indiapost.gov.in' },
  { label: 'DTDC Express', value: 'DTDC Express', defaultUrl: 'https://www.dtdc.in' },
  { label: 'Franch Express', value: 'Franch Express', defaultUrl: 'https://www.franchexpress.com' },
  { label: 'Trackon Couriers', value: 'Trackon Couriers', defaultUrl: 'https://trackon.in' },
  { label: 'Blue Dart', value: 'Blue Dart', defaultUrl: 'https://www.bluedart.com' },
  { label: 'Delhivery', value: 'Delhivery', defaultUrl: 'https://www.delhivery.com' },
  { label: 'Other / Custom Courier', value: 'OTHER', defaultUrl: '' },
];

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
  const [selectedCourierKey, setSelectedCourierKey] = useState<string>('The Professional Couriers');
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null);

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
    const existingCourier = order.shipment?.courierName || 'The Professional Couriers';
    const matchedOption = COURIER_OPTIONS.find((c) => c.value === existingCourier);

    const courierKey = matchedOption ? matchedOption.value : 'OTHER';
    setSelectedCourierKey(courierKey);

    statusForm.setFieldsValue({
      status:
        order.status === 'PENDING' || order.status === 'CONFIRMED' || order.status === 'PROCESSING'
          ? 'SHIPPED'
          : order.status,
      courierSelect: courierKey,
      customCourierName: courierKey === 'OTHER' ? existingCourier : '',
      trackingNumber: order.shipment?.trackingNumber || '',
      trackingUrl: order.shipment?.trackingUrl || (matchedOption?.defaultUrl || ''),
      remarks: order.shipment?.remarks || '',
    });
    setIsStatusModalOpen(true);
  };

  const handleCourierSelectChange = (value: string) => {
    setSelectedCourierKey(value);
    const matched = COURIER_OPTIONS.find((c) => c.value === value);
    if (matched && matched.defaultUrl) {
      const currentUrl = statusForm.getFieldValue('trackingUrl');
      if (!currentUrl || COURIER_OPTIONS.some((c) => c.defaultUrl === currentUrl)) {
        statusForm.setFieldValue('trackingUrl', matched.defaultUrl);
      }
    }
  };

  const handleOpenCancelModal = (order: Order) => {
    setSelectedOrder(order);
    cancelForm.resetFields();
    setIsCancelModalOpen(true);
  };

  const handleStatusSubmit = async (values: any) => {
    if (!selectedOrder) return;

    const courierName =
      values.courierSelect === 'OTHER'
        ? values.customCourierName?.trim() || 'Custom Courier'
        : values.courierSelect;

    await updateStatus.mutateAsync({
      id: selectedOrder.id,
      status: values.status,
      courierName,
      trackingNumber: values.trackingNumber?.trim(),
      trackingUrl: values.trackingUrl?.trim(),
      remarks: values.remarks?.trim(),
    });
    setIsStatusModalOpen(false);
    setIsDetailDrawerOpen(false);
  };

  const handleCopyTracking = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTrackingId(text);
    toast.success('Tracking ID copied to clipboard!');
    setTimeout(() => setCopiedTrackingId(null), 2000);
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

  const [isExporting, setIsExporting] = useState(false);

  const handleExportCsv = async () => {
    try {
      setIsExporting(true);
      toast.loading('Preparing orders spreadsheet export...', { id: 'csv-export' });

      const blob = await salesService.exportOrdersCsv({
        search: search || undefined,
        status: statusFilter,
        paymentStatus: paymentFilter,
        startDate: dateRange ? dateRange[0] : undefined,
        endDate: dateRange ? dateRange[1] : undefined,
      });

      const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv;charset=utf-8;' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders-export-${dayjs().format('YYYY-MM-DD-HHmm')}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast.success('Orders exported successfully!', { id: 'csv-export' });
    } catch (error) {
      console.error('Failed to export CSV', error);
      toast.error('Failed to export orders spreadsheet', { id: 'csv-export' });
    } finally {
      setIsExporting(false);
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
      title: 'Order & Tracking Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string, record: Order) => (
        <div className="space-y-1">
          <StatusBadge status={status} category="order" />
          {record.shipment?.courierName && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                <Truck className="w-2.5 h-2.5 text-[#A50025]" />
                {record.shipment.courierName}
              </span>
              {record.shipment.trackingNumber && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyTracking(record.shipment!.trackingNumber!);
                  }}
                  className="font-mono text-[10px] font-bold text-[#A50025] hover:underline cursor-pointer flex items-center gap-0.5"
                  title="Click to copy Tracking ID"
                >
                  <span>#{record.shipment.trackingNumber}</span>
                  {copiedTrackingId === record.shipment.trackingNumber ? (
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-2.5 h-2.5 opacity-70" />
                  )}
                </button>
              )}
            </div>
          )}
          {!record.shipment?.trackingNumber && record.status !== 'CANCELLED' && (
            <button
              onClick={() => handleOpenStatusModal(record)}
              className="text-[10px] font-bold text-[#A50025] hover:underline flex items-center gap-0.5"
            >
              + Add Tracking ID
            </button>
          )}
        </div>
      ),
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
                  icon: <Truck className="w-4 h-4 text-[#A50025]" />,
                  label: 'Dispatch / Add Tracking ID',
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
              Awaiting warehouse dispatch
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
        title="Orders & Fulfillment"
        subtitle="Manage customer orders, physical courier dispatch slips, and tracking numbers."
        action={
          <Button
            type="primary"
            icon={<Download className="w-4 h-4" />}
            onClick={handleExportCsv}
            loading={isExporting}
            disabled={isExporting}
            className="rounded-lg font-bold text-xs bg-[#A50025] hover:bg-[#7D001C] text-white h-9 px-4"
          >
            Export Orders
          </Button>
        }
      />

      {/* Orders Table Card with Filters */}
      <AdminCard>
        <TableToolbar
          searchPlaceholder="Search order #, customer name, email, phone..."
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          filters={
            <>
              <Select
                placeholder="Order Status"
                allowClear
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setPage(1);
                }}
                className="w-36"
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
                allowClear
                value={paymentFilter}
                onChange={(val) => {
                  setPaymentFilter(val);
                  setPage(1);
                }}
                className="w-36"
              >
                <Select.Option value="PENDING">Pending</Select.Option>
                <Select.Option value="PAID">Paid</Select.Option>
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
                  setPage(1);
                }}
                className="w-56"
              />
            </>
          }
          onReset={() => {
            setSearch('');
            setStatusFilter(undefined);
            setPaymentFilter(undefined);
            setDateRange(undefined);
            setPage(1);
          }}
        />

        <Table
          columns={columns}
          dataSource={ordersData?.orders || []}
          rowKey="id"
          loading={isOrdersLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: ordersData?.meta?.total || 0,
            showSizeChanger: true,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showTotal: (total) => `Total ${total} orders`,
          }}
          className="admin-table"
        />
      </AdminCard>

      {/* Order Details Drawer */}
      <Drawer
        title={
          selectedOrder ? (
            <div className="flex items-center justify-between gap-3 pr-6">
              <div>
                <span className="font-mono text-sm font-black text-[#A50025]">
                  Order #{selectedOrder.orderNumber}
                </span>
                <span className="text-[11px] text-[#64748B] block font-medium">
                  Placed on {dayjs(selectedOrder.createdAt).format('MMMM D, YYYY h:mm A')}
                </span>
              </div>
              <StatusBadge status={selectedOrder.status} category="order" />
            </div>
          ) : (
            'Order Details'
          )
        }
        placement="right"
        size="large"
        onClose={() => setIsDetailDrawerOpen(false)}
        open={isDetailDrawerOpen}
        extra={
          selectedOrder && (
            <Space>
              <Button
                icon={<Truck className="w-3.5 h-3.5" />}
                type="primary"
                onClick={() => handleOpenStatusModal(selectedOrder)}
                className="bg-[#A50025] hover:bg-[#7D001C] text-xs font-bold"
              >
                Update Tracking
              </Button>
              <Button
                icon={<FileText className="w-3.5 h-3.5" />}
                onClick={() => setIsInvoiceOpen(true)}
                className="text-xs font-bold"
              >
                Invoice
              </Button>
            </Space>
          )
        }
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs">
            {/* Courier Dispatch & Tracking Banner */}
            <div className="bg-gradient-to-br from-red-50/60 to-orange-50/50 p-4 rounded-xl border border-red-200/80 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#A50025] font-extrabold text-xs uppercase tracking-wider">
                  <Truck className="w-4 h-4" />
                  <span>Courier & Dispatch Tracking</span>
                </div>
                <Button
                  size="small"
                  onClick={() => handleOpenStatusModal(selectedOrder)}
                  className="text-[11px] font-bold text-[#A50025] border-[#A50025]/30 hover:bg-white"
                >
                  Edit Tracking Slip
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/80 p-2.5 rounded-lg border border-red-100">
                  <span className="text-[#64748B] text-[10px] block font-bold uppercase tracking-wider">
                    Courier Partner
                  </span>
                  <span className="font-bold text-[#111827] text-xs">
                    {selectedOrder.shipment?.courierName || 'The Professional Couriers'}
                  </span>
                </div>

                <div className="bg-white/80 p-2.5 rounded-lg border border-red-100">
                  <span className="text-[#64748B] text-[10px] block font-bold uppercase tracking-wider">
                    Tracking / Consignment #
                  </span>
                  {selectedOrder.shipment?.trackingNumber ? (
                    <button
                      type="button"
                      onClick={() => handleCopyTracking(selectedOrder.shipment!.trackingNumber!)}
                      className="font-mono font-bold text-[#A50025] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <span>{selectedOrder.shipment.trackingNumber}</span>
                      {copiedTrackingId === selectedOrder.shipment.trackingNumber ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3 opacity-70" />
                      )}
                    </button>
                  ) : (
                    <span className="text-amber-600 font-medium italic">Pending entry</span>
                  )}
                </div>
              </div>

              {selectedOrder.shipment?.trackingUrl && (
                <div className="pt-1">
                  <a
                    href={selectedOrder.shipment.trackingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#A50025] hover:underline bg-white px-3 py-1.5 rounded-lg border border-red-200"
                  >
                    <span>Open Courier Tracking Portal</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Financial & Status Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="text-[#64748B] font-semibold block text-[11px]">Total Paid</span>
                <span className="text-base font-black text-[#111827] mt-0.5 block">
                  ₹{Number(selectedOrder.total).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-[#64748B]">
                  Sub: ₹{Number(selectedOrder.subtotal).toLocaleString('en-IN')} | Ship: ₹{Number(selectedOrder.shipping).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="text-[#64748B] font-semibold block text-[11px]">Payment</span>
                <div className="mt-1">
                  <StatusBadge
                    status={selectedOrder.payments?.[0]?.status || 'PENDING'}
                    category="payment"
                  />
                </div>
                <span className="text-[10px] text-[#64748B] mt-0.5 block">
                  Via {selectedOrder.payments?.[0]?.paymentMethod || 'ONLINE'}
                </span>
              </div>

              <div className="bg-[#F7F8FA] p-3 rounded-xl border border-[#E5E7EB]">
                <span className="text-[#64748B] font-semibold block text-[11px]">Fulfillment</span>
                <div className="mt-1">
                  <StatusBadge status={selectedOrder.status} category="order" />
                </div>
                <span className="text-[10px] text-[#64748B] mt-0.5 block">
                  {selectedOrder.items?.length || 0} Line Items
                </span>
              </div>
            </div>

            {/* Customer & Shipping Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Direct Warehouse Order Fulfillment Breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-extrabold text-[#111827] text-xs uppercase tracking-wider">
                  Ordered Items & Fulfillment
                </h4>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Vistora Central Warehouse Inventory
                </span>
              </div>

              <div className="space-y-2.5">
                {selectedOrder.items.map((item) => (
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
                  </div>
                ))}
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

      {/* Courier Dispatch & Tracking Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-slate-900 font-extrabold">
            <Truck className="w-5 h-5 text-[#A50025]" />
            <span>Courier Dispatch & Tracking Details</span>
          </div>
        }
        open={isStatusModalOpen}
        onCancel={() => setIsStatusModalOpen(false)}
        onOk={() => statusForm.submit()}
        confirmLoading={updateStatus.isPending}
        okText="Save & Update Order"
        okButtonProps={{ className: 'bg-[#A50025] hover:bg-[#7D001C] font-bold' }}
      >
        <Form form={statusForm} layout="vertical" onFinish={handleStatusSubmit} className="mt-4">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 mb-4">
            Enter the <strong>Courier Service Name</strong> and physical <strong>Consignment / Tracking ID</strong> provided by your local courier office (*e.g., The Professional Couriers, ST Courier, India Post*).
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item
              name="courierSelect"
              label="Courier Service Partner"
              rules={[{ required: true, message: 'Please select courier partner' }]}
            >
              <Select onChange={handleCourierSelectChange} placeholder="Select courier service">
                {COURIER_OPTIONS.map((c) => (
                  <Select.Option key={c.value} value={c.value}>
                    {c.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {selectedCourierKey === 'OTHER' && (
              <Form.Item
                name="customCourierName"
                label="Custom Courier Name"
                rules={[{ required: true, message: 'Enter custom courier name' }]}
              >
                <Input placeholder="e.g. Local Fast Delivery" />
              </Form.Item>
            )}

            <Form.Item
              name="trackingNumber"
              label="Courier Tracking / Consignment ID (AWB)"
              rules={[{ required: true, message: 'Please enter tracking / receipt number' }]}
            >
              <Input
                placeholder="e.g. TPC84920492IN or STC129482"
                prefix={<Truck className="w-3.5 h-3.5 text-slate-400" />}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Form.Item name="status" label="Order Status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="SHIPPED">Shipped (Dispatched to Courier)</Select.Option>
                <Select.Option value="OUT_FOR_DELIVERY">Out for Delivery</Select.Option>
                <Select.Option value="DELIVERED">Delivered</Select.Option>
                <Select.Option value="CONFIRMED">Confirmed</Select.Option>
                <Select.Option value="PROCESSING">Processing</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="trackingUrl" label="Courier Website / Tracking Portal URL">
              <Input placeholder="https://www.tpcindia.com" />
            </Form.Item>
          </div>

          <Form.Item name="remarks" label="Counter / Dispatch Notes (Optional)">
            <Input.TextArea rows={2} placeholder="e.g. Handed over package at branch counter..." />
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
