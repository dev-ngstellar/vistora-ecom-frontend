'use client';

import React, { useState } from 'react';
import { useInventory, useInventoryMutations } from '@/hooks/use-catalogue';
import { InventoryItem } from '@/services/catalogue.service';
import { brandConfig } from '@/config';
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Tag,
  Space,
  Drawer,
  Radio,
  Badge,
  Card,
} from 'antd';
import {
  Boxes,
  Search,
  AlertTriangle,
  PackageX,
  RefreshCw,
  Plus,
  Minus,
  SlidersHorizontal,
  History,
  TrendingUp,
  CheckCircle2,
  PackageCheck,
  ShieldAlert,
} from 'lucide-react';

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string | undefined>();

  const { data: inventoryItems = [], isLoading, refetch } = useInventory({
    q: searchTerm,
    stockStatus: stockStatusFilter,
  });

  const { adjustStock } = useInventoryMutations();

  // Stock Adjustment Modal
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [historyItem, setHistoryItem] = useState<InventoryItem | null>(null);
  const [form] = Form.useForm();

  // Compute warehouse KPI metrics
  const totalAvailable = inventoryItems.reduce((sum, item) => sum + item.availableStock, 0);
  const totalReserved = inventoryItems.reduce((sum, item) => sum + item.reservedStock, 0);
  const lowStockCount = inventoryItems.filter((item) => item.stockStatus === 'LOW_STOCK').length;
  const outOfStockCount = inventoryItems.filter((item) => item.stockStatus === 'OUT_OF_STOCK').length;

  const handleOpenAdjustModal = (item: InventoryItem) => {
    setAdjustingItem(item);
    form.setFieldsValue({
      action: 'ADD',
      quantity: 1,
      reason: 'PURCHASE_RECEIVED',
      lowStockThreshold: item.lowStockThreshold || 10,
      remarks: '',
    });
  };

  const handleAdjustSubmit = async (values: Record<string, any>) => {
    if (!adjustingItem) return;
    await adjustStock.mutateAsync({
      inventoryId: adjustingItem.id,
      action: values.action,
      quantity: values.quantity,
      reason: values.reason,
      lowStockThreshold: values.lowStockThreshold,
      remarks: values.remarks,
    });
    setAdjustingItem(null);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Product & Variant Details',
      key: 'product_details',
      render: (_: any, record: InventoryItem) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <Boxes className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{record.productName}</span>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span className="text-indigo-600 font-semibold">{record.variantName}</span>
              <span>• Category: {record.categoryName}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (sku: string) => <span className="font-mono text-xs font-bold text-slate-700">{sku}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => (
        <span className="font-extrabold text-slate-900 text-xs">
          {brandConfig.currency.symbol}{Number(price).toFixed(2)}
        </span>
      ),
    },
    {
      title: 'Stock Quantities',
      key: 'stock_breakdown',
      render: (_: any, record: InventoryItem) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <span>Available: {record.availableStock}</span>
          </div>
          <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-2">
            <span>Reserved: {record.reservedStock}</span>
            <span>• Sold: {record.soldStock}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Low Threshold',
      dataIndex: 'lowStockThreshold',
      key: 'lowStockThreshold',
      render: (threshold: number) => (
        <span className="text-xs font-semibold text-slate-500">{threshold} units</span>
      ),
    },
    {
      title: 'Stock Status',
      dataIndex: 'stockStatus',
      key: 'stockStatus',
      render: (status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK') => {
        if (status === 'OUT_OF_STOCK') {
          return (
            <Tag color="red" className="font-extrabold uppercase text-[10px] px-2.5 py-0.5 rounded-full">
              Out of Stock
            </Tag>
          );
        }
        if (status === 'LOW_STOCK') {
          return (
            <Tag color="orange" className="font-extrabold uppercase text-[10px] px-2.5 py-0.5 rounded-full">
              Low Stock Warning
            </Tag>
          );
        }
        return (
          <Tag color="green" className="font-extrabold uppercase text-[10px] px-2.5 py-0.5 rounded-full">
            In Stock
          </Tag>
        );
      },
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <span className="text-xs text-slate-500 font-medium">
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: InventoryItem) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<SlidersHorizontal className="w-3.5 h-3.5" />}
            onClick={() => handleOpenAdjustModal(record)}
            className="rounded-xl font-bold bg-slate-900 hover:bg-indigo-600 text-xs"
          >
            Adjust Stock
          </Button>
          <Button
            type="text"
            size="small"
            icon={<History className="w-4 h-4 text-slate-600" />}
            title="Stock Movement Log"
            onClick={() => setHistoryItem(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Boxes className="w-4 h-4" />
            <span>Warehouse Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Inventory & Stock Control
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time warehouse stock tracking, available vs reserved stock, low stock thresholds, and movement audit logs.
          </p>
        </div>

        <Button
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={() => refetch()}
          className="rounded-2xl font-bold text-xs"
        >
          Refresh Stock
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Available Stock</span>
            <span className="text-2xl font-black text-slate-900">{totalAvailable}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Reserved Orders</span>
            <span className="text-2xl font-black text-purple-900">{totalReserved}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Low Stock Alert</span>
            <span className="text-2xl font-black text-amber-600">{lowStockCount}</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-red-50 text-red-600">
            <PackageX className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">Out of Stock</span>
            <span className="text-2xl font-black text-red-600">{outOfStockCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name, variant, or SKU..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <Select
          allowClear
          placeholder="Filter Stock Status"
          value={stockStatusFilter}
          onChange={(val) => setStockStatusFilter(val)}
          className="w-48"
          options={[
            { label: 'In Stock', value: 'IN_STOCK' },
            { label: 'Low Stock Warning', value: 'LOW_STOCK' },
            { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
          ]}
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={inventoryItems}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Stock Adjustment Modal */}
      <Modal
        title={`Adjust Stock: ${adjustingItem?.productName} (${adjustingItem?.variantName})`}
        open={!!adjustingItem}
        onCancel={() => setAdjustingItem(null)}
        onOk={() => form.submit()}
        okText="Save Adjustment"
        okButtonProps={{ className: 'font-bold bg-slate-900 hover:bg-indigo-600' }}
      >
        <Form form={form} layout="vertical" onFinish={handleAdjustSubmit} className="pt-2 space-y-4">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block font-semibold">Current Available Stock</span>
              <span className="text-lg font-black text-slate-900">{adjustingItem?.availableStock} units</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold">SKU</span>
              <span className="font-mono font-bold text-slate-700">{adjustingItem?.sku}</span>
            </div>
          </div>

          <Form.Item name="action" label={<span className="font-bold text-xs">Adjustment Action</span>} rules={[{ required: true }]}>
            <Radio.Group buttonStyle="solid" className="w-full">
              <Radio.Button value="ADD" className="w-1/3 text-center font-bold text-xs">+ Add Stock</Radio.Button>
              <Radio.Button value="REMOVE" className="w-1/3 text-center font-bold text-xs">- Remove Stock</Radio.Button>
              <Radio.Button value="SET" className="w-1/3 text-center font-bold text-xs">= Set Exact Stock</Radio.Button>
            </Radio.Group>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="quantity"
              label={<span className="font-bold text-xs">Quantity Units</span>}
              rules={[{ required: true, message: 'Quantity is required' }]}
            >
              <InputNumber min={1} className="w-full rounded-xl" />
            </Form.Item>

            <Form.Item
              name="lowStockThreshold"
              label={<span className="font-bold text-xs">Low Stock Threshold</span>}
            >
              <InputNumber min={1} className="w-full rounded-xl" />
            </Form.Item>
          </div>

          <Form.Item
            name="reason"
            label={<span className="font-bold text-xs">Adjustment Reason</span>}
            rules={[{ required: true, message: 'Reason is required' }]}
          >
            <Select
              options={[
                { label: 'Purchase Received (Stock In)', value: 'PURCHASE_RECEIVED' },
                { label: 'Sales Order Fulfilled', value: 'SALES_ORDER' },
                { label: 'Return Restock (Customer Return)', value: 'RETURN_RESTOCK' },
                { label: 'Inventory Audit Adjustment', value: 'INVENTORY_AUDIT' },
                { label: 'Damage / Loss', value: 'DAMAGE' },
                { label: 'Manual Adjustment', value: 'MANUAL_ADJUSTMENT' },
              ]}
            />
          </Form.Item>

          <Form.Item name="remarks" label={<span className="font-bold text-xs">Remarks / Audit Note</span>}>
            <Input.TextArea rows={2} placeholder="Optional notes for stock movement audit trail..." className="rounded-xl" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Movement History Drawer */}
      <Drawer
        title={`Stock Movement History: ${historyItem?.productName} (${historyItem?.variantName})`}
        styles={{ wrapper: { width: '540px', maxWidth: '100vw' } }}
        open={!!historyItem}
        onClose={() => setHistoryItem(null)}
      >
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-500 font-semibold block">Current Available Stock</span>
              <span className="text-xl font-black text-slate-900">{historyItem?.availableStock} units</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block">Low Stock Threshold</span>
              <span className="text-sm font-bold text-amber-700">{historyItem?.lowStockThreshold} units</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Recent Movement Trail</span>
            {historyItem?.stockMovements && historyItem.stockMovements.length > 0 ? (
              historyItem.stockMovements.map((sm, idx) => (
                <Card key={idx} size="small" className="rounded-2xl border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{sm.movementType}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{new Date(sm.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-2 text-xs flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      Stock: {sm.previousStock} &rarr; <span className="font-bold text-indigo-600">{sm.currentStock}</span>
                    </span>
                    <Tag color={sm.currentStock >= sm.previousStock ? 'green' : 'red'}>
                      {sm.currentStock >= sm.previousStock ? `+${sm.quantity}` : `-${sm.quantity}`}
                    </Tag>
                  </div>
                  {sm.remarks && (
                    <p className="text-[11px] text-slate-500 italic mt-1 border-t border-slate-100 pt-1">
                      {sm.remarks}
                    </p>
                  )}
                </Card>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl">
                No recent stock movement logs recorded.
              </div>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
}
