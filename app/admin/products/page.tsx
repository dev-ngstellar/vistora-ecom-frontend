'use client';

import React, { useState } from 'react';
import {
  useBrands,
  useCategories,
  useCollections,
  useProductMutations,
  useProducts,
} from '@/hooks/use-catalogue';
import { Product, ProductStatus, ProductVariant, ProductImage } from '@/types/catalogue.types';
import { MediaUpload, UploadedMediaItem } from '@/components/ui/media-upload';
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
  Avatar,
  Drawer,
  Switch,
  Tabs,
  Card,
  Popconfirm,
  Badge,
} from 'antd';
import { modal } from '@/lib/antd';
import {
  Plus,
  Edit,
  Trash2,
  Copy,
  ShoppingBag,
  Search,
  Sparkles,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  FolderPlus,
  Award,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import { TableToolbar } from '@/components/admin/table-toolbar';

export default function AdminProductsPage() {
  // Query Filters & Pagination State
  const [query, setQuery] = useState<{
    q?: string;
    categoryId?: string;
    brandId?: string;
    collectionId?: string;
    status?: ProductStatus;
    page: number;
  }>({ page: 1 });

  const { data: productsData, isLoading, refetch } = useProducts({
    page: query.page,
    limit: 10,
    q: query.q,
    categoryId: query.categoryId,
    brandId: query.brandId,
    collectionId: query.collectionId,
    status: query.status,
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();

  const { createProduct, updateProduct, deleteProduct, duplicateProduct, bulkAction } =
    useProductMutations();

  // Drawer State & Form
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<UploadedMediaItem[]>([]);
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Bulk Modal State
  const [bulkAssignModal, setBulkAssignModal] = useState<{
    open: boolean;
    type: 'CATEGORY' | 'BRAND';
  }>({ open: false, type: 'CATEGORY' });
  const [bulkTargetId, setBulkTargetId] = useState<string>('');

  const [form] = Form.useForm();

  const products = productsData?.items || [];
  const meta = productsData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenDrawer = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setImages(
        product.images?.map((img) => ({
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          altText: img.altText || '',
        })) || []
      );
      setVariants(product.variants || []);
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        barcode: product.barcode,
        categoryId: product.categoryId,
        brandId: product.brandId,
        collectionId: product.collectionId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        costPrice: product.costPrice,
        taxRate: product.taxRate,
        shortDescription: product.shortDescription,
        description: product.description,
        status: product.status,
        visibility: product.visibility,
        featured: product.featured,
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
      });
    } else {
      setEditingProduct(null);
      setImages([]);
      setVariants([]);
      form.resetFields();
      form.setFieldsValue({
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        featured: false,
        price: 0,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    const payload: Record<string, any> = {};
    const numericFields = ['price', 'compareAtPrice', 'costPrice', 'taxRate'];
    
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (val === '' || val === undefined) {
        payload[key] = null;
      } else if (numericFields.includes(key) && val !== null) {
        payload[key] = Number(val);
      } else {
        payload[key] = val;
      }
    });

    // Attach processed images and variants
    payload.images = images.map((img, idx) => ({
      imageUrl: img.imageUrl,
      isPrimary: img.isPrimary ?? idx === 0,
      sortOrder: idx,
      altText: img.altText || payload.name,
    }));

    payload.variants = variants.map((v) => ({
      sku: v.sku || `${payload.sku}-${v.color || ''}-${v.size || ''}`,
      color: v.color || null,
      size: v.size || null,
      barcode: v.barcode || null,
      price: v.price != null ? Number(v.price) : Number(payload.price || 0),
      stock: v.stock != null ? Number(v.stock) : 0,
      status: v.status || 'ACTIVE',
    }));

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: payload as Partial<Product> });
    } else {
      await createProduct.mutateAsync(payload as Partial<Product>);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to soft delete this product from catalog?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteProduct.mutate(id),
    });
  };

  const handleDuplicate = (product: Product) => {
    modal.confirm({
      title: 'Duplicate Product',
      content: `Create a draft clone of "${product.name}"?`,
      okText: 'Duplicate',
      onOk: () => duplicateProduct.mutate(product),
    });
  };

  // Variant Helpers inside Form
  const handleAddVariant = () => {
    const defaultSku = `${form.getFieldValue('sku') || 'SKU'}-VAR-${variants.length + 1}`;
    setVariants([
      ...variants,
      {
        sku: defaultSku,
        color: '',
        size: '',
        price: form.getFieldValue('price') || 0,
        stock: 10,
        status: 'ACTIVE',
      },
    ]);
  };

  const handleUpdateVariant = (index: number, key: string, value: any) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [key]: value };
    setVariants(updated);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  // Bulk Actions
  const handleExecuteBulk = async (action: string) => {
    if (selectedRowKeys.length === 0) {
      toast.error('Please select products using table checkboxes first');
      return;
    }

    if (action === 'ASSIGN_CATEGORY' || action === 'ASSIGN_BRAND') {
      setBulkAssignModal({ open: true, type: action === 'ASSIGN_CATEGORY' ? 'CATEGORY' : 'BRAND' });
      setBulkTargetId('');
      return;
    }

    modal.confirm({
      title: `Bulk ${action}`,
      content: `Are you sure you want to perform '${action}' on ${selectedRowKeys.length} selected product(s)?`,
      okText: 'Confirm Action',
      onOk: async () => {
        await bulkAction.mutateAsync({
          action,
          productIds: selectedRowKeys as string[],
        });
        setSelectedRowKeys([]);
      },
    });
  };

  const handleConfirmBulkAssign = async () => {
    if (!bulkTargetId) {
      toast.error('Please select a target option');
      return;
    }
    const action = bulkAssignModal.type === 'CATEGORY' ? 'ASSIGN_CATEGORY' : 'ASSIGN_BRAND';
    await bulkAction.mutateAsync({
      action,
      productIds: selectedRowKeys as string[],
      targetId: bulkTargetId,
    });
    setBulkAssignModal({ open: false, type: 'CATEGORY' });
    setSelectedRowKeys([]);
  };

  const columns = [
    {
      title: 'Thumbnail & Product',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => {
        const image =
          record.images?.find((i) => i.isPrimary)?.imageUrl ||
          record.images?.[0]?.imageUrl ||
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100';

        return (
          <div className="flex items-center gap-3">
            <Avatar src={image} shape="square" size={52} className="rounded-xl border border-slate-200 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 block line-clamp-1">{text}</span>
                {record.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 shrink-0">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-0.5">
                <span>SKU: {record.sku}</span>
                {record.barcode && <span>• Barcode: {record.barcode}</span>}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Retailer & Category',
      key: 'brand_category',
      render: (_: any, record: Product) => (
        <div className="space-y-0.5 text-xs">
          <div className="font-bold text-slate-800 flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-indigo-600" />
            <span>{record.brand?.name || 'Unassigned Retailer'}</span>
          </div>
          <div className="text-slate-500 font-semibold flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{record.category?.name || 'General'}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Total Stock',
      key: 'stock',
      render: (_: any, record: Product) => {
        const totalStock = record.variants && record.variants.length > 0
          ? record.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
          : 0;

        return (
          <div>
            <span className="font-extrabold text-slate-900 block text-xs">{totalStock} units</span>
            {record.variants && record.variants.length > 0 && (
              <span className="text-[10px] font-semibold text-slate-400">
                {record.variants.length} variant(s)
              </span>
            )}
          </div>
        );
      },
    },
    {
      title: 'Selling Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) => (
        <div>
          <span className="font-extrabold text-slate-900 block text-xs">
            {brandConfig.currency.symbol}{Number(price).toFixed(2)}
          </span>
          {record.compareAtPrice && (
            <span className="text-[11px] text-slate-400 line-through block">
              {brandConfig.currency.symbol}{Number(record.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: ProductStatus) => {
        const colorMap: Record<ProductStatus, string> = {
          ACTIVE: 'green',
          DRAFT: 'orange',
          OUT_OF_STOCK: 'red',
          INACTIVE: 'volcano',
          ARCHIVED: 'default',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: 'Updated Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <span className="text-xs font-semibold text-slate-500">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Product) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Copy className="w-4 h-4 text-slate-600" />}
            title="Duplicate Product"
            onClick={() => handleDuplicate(record)}
          />
          <Button
            type="text"
            icon={<Edit className="w-4 h-4 text-indigo-600" />}
            title="Edit Product"
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Product"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Page Header with Action Button */}
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog, pricing, variants, and stock availability."
        action={
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenDrawer()}
            className="rounded-lg font-bold bg-[#A50025] hover:bg-[#7D001C] text-white h-9 px-4 text-xs"
          >
            Create Product
          </Button>
        }
        toolbar={
          <TableToolbar
            searchValue={query.q || ''}
            onSearchChange={(val) => setQuery((prev) => ({ ...prev, q: val, page: 1 }))}
            searchPlaceholder="Search product name, SKU, barcode..."
            onReset={() => setQuery({ page: 1 })}
            filters={
              <div className="flex items-center gap-2 flex-wrap">
                <Select
                  allowClear
                  placeholder="Category"
                  value={query.categoryId}
                  onChange={(val) => setQuery((prev) => ({ ...prev, categoryId: val, page: 1 }))}
                  className="w-36 text-xs"
                  options={categories?.map((c) => ({ label: c.name, value: c.id }))}
                />
                <Select
                  allowClear
                  placeholder="Retailer"
                  value={query.brandId}
                  onChange={(val) => setQuery((prev) => ({ ...prev, brandId: val, page: 1 }))}
                  className="w-36 text-xs"
                  options={brands?.map((b) => ({ label: b.name, value: b.id }))}
                />
                <Select
                  allowClear
                  placeholder="Status"
                  value={query.status}
                  onChange={(val) => setQuery((prev) => ({ ...prev, status: val, page: 1 }))}
                  className="w-32 text-xs"
                  options={[
                    { label: 'ACTIVE', value: 'ACTIVE' },
                    { label: 'DRAFT', value: 'DRAFT' },
                    { label: 'OUT_OF_STOCK', value: 'OUT_OF_STOCK' },
                    { label: 'INACTIVE', value: 'INACTIVE' },
                    { label: 'ARCHIVED', value: 'ARCHIVED' },
                  ]}
                />
              </div>
            }
          />
        }
      />

      {/* Bulk Action Bar */}
      {selectedRowKeys.length > 0 && (
        <div className="bg-[#FFF0F3] border border-[#A50025]/30 p-3 rounded-xl flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-[#A50025]">
            {selectedRowKeys.length} product(s) selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={() => handleExecuteBulk('ACTIVATE')}
              icon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
            >
              Activate
            </Button>
            <Button
              size="small"
              onClick={() => handleExecuteBulk('DEACTIVATE')}
              icon={<XCircle className="w-3.5 h-3.5 text-amber-600" />}
            >
              Deactivate
            </Button>
            <Button
              size="small"
              onClick={() => handleExecuteBulk('ASSIGN_CATEGORY')}
              icon={<FolderPlus className="w-3.5 h-3.5 text-indigo-600" />}
            >
              Assign Category
            </Button>
            <Button
              size="small"
              onClick={() => handleExecuteBulk('ASSIGN_BRAND')}
              icon={<Award className="w-3.5 h-3.5 text-purple-600" />}
            >
              Assign Retailer
            </Button>
            <Button
              size="small"
              danger
              onClick={() => handleExecuteBulk('DELETE')}
              icon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <AdminCard headerBorder={false} className="p-0">
        <Table
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
          }}
          columns={columns}
          dataSource={products}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: meta.page,
            pageSize: meta.limit,
            total: meta.total,
            onChange: (page) => setQuery((prev) => ({ ...prev, page })),
          }}
        />
      </AdminCard>

      {/* Product Create / Edit Drawer */}
      <Drawer
        title={editingProduct ? `Edit Product: ${editingProduct.name}` : 'Create New Product'}
        styles={{ wrapper: { width: '720px', maxWidth: '100vw' } }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="font-bold bg-slate-900 hover:bg-indigo-600"
          >
            {editingProduct ? 'Save Product' : 'Publish Product'}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-6">
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: '1',
                label: <span className="font-bold text-xs">1. Basic Info & Media</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item
                      name="name"
                      label={<span className="font-bold text-xs">Product Name</span>}
                      rules={[{ required: true, message: 'Product name is required' }]}
                    >
                      <Input placeholder="e.g. Italian Cashmere Blazer" className="rounded-xl" />
                    </Form.Item>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="sku"
                        label={<span className="font-bold text-xs">SKU Code</span>}
                        rules={[{ required: true, message: 'SKU is required' }]}
                      >
                        <Input placeholder="e.g. BLZ-101" className="rounded-xl font-mono" />
                      </Form.Item>

                      <Form.Item name="barcode" label={<span className="font-bold text-xs">Barcode / EAN</span>}>
                        <Input placeholder="e.g. 890123456789" className="rounded-xl font-mono" />
                      </Form.Item>
                    </div>

                    {/* Shared Media Upload Component */}
                    <div>
                      <label className="font-bold text-xs block mb-2">Product Images Gallery</label>
                      <MediaUpload
                        multiple
                        value={images}
                        onChange={(val) => setImages(val || [])}
                      />
                    </div>

                    <Form.Item name="shortDescription" label={<span className="font-bold text-xs">Short Summary</span>}>
                      <Input.TextArea rows={2} placeholder="Brief product summary for cards..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="description" label={<span className="font-bold text-xs">Full Editorial Description</span>}>
                      <Input.TextArea rows={4} placeholder="Comprehensive description..." className="rounded-xl" />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: '2',
                label: <span className="font-bold text-xs">2. Organization & Pricing</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 gap-4">
                      <Form.Item
                        name="categoryId"
                        label={<span className="font-bold text-xs">Category</span>}
                        rules={[{ required: true, message: 'Category is required' }]}
                      >
                        <Select
                          placeholder="Select Category"
                          options={categories?.map((c) => ({ label: c.name, value: c.id }))}
                        />
                      </Form.Item>

                      <Form.Item name="brandId" label={<span className="font-bold text-xs">Retailer</span>}>
                        <Select
                          allowClear
                          placeholder="Select Retailer"
                          options={brands?.map((b) => ({ label: b.name, value: b.id }))}
                        />
                      </Form.Item>

                      <Form.Item name="collectionId" label={<span className="font-bold text-xs">Collection</span>}>
                        <Select
                          allowClear
                          placeholder="Select Collection"
                          options={collections?.map((cl) => ({ label: cl.name, value: cl.id }))}
                        />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="price"
                        label={<span className="font-bold text-xs">Retail Price ({brandConfig.currency.symbol})</span>}
                        rules={[{ required: true, message: 'Price is required' }]}
                      >
                        <InputNumber min={0} className="w-full rounded-xl" prefix={brandConfig.currency.symbol} />
                      </Form.Item>

                      <Form.Item
                        name="compareAtPrice"
                        label={<span className="font-bold text-xs">Compare At Price ({brandConfig.currency.symbol})</span>}
                      >
                        <InputNumber min={0} className="w-full rounded-xl" prefix={brandConfig.currency.symbol} />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item name="costPrice" label={<span className="font-bold text-xs">Cost Price ({brandConfig.currency.symbol})</span>}>
                        <InputNumber min={0} className="w-full rounded-xl" prefix={brandConfig.currency.symbol} />
                      </Form.Item>

                      <Form.Item name="taxRate" label={<span className="font-bold text-xs">Tax Rate (%)</span>}>
                        <InputNumber min={0} max={100} className="w-full rounded-xl" suffix="%" />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-2">
                      <Form.Item name="status" label={<span className="font-bold text-xs">Publication Status</span>}>
                        <Select
                          options={[
                            { label: 'Active', value: 'ACTIVE' },
                            { label: 'Draft', value: 'DRAFT' },
                            { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
                            { label: 'Inactive', value: 'INACTIVE' },
                            { label: 'Archived', value: 'ARCHIVED' },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item name="visibility" label={<span className="font-bold text-xs">Catalog Visibility</span>}>
                        <Select
                          options={[
                            { label: 'Public Storefront', value: 'PUBLIC' },
                            { label: 'Private / Hidden', value: 'PRIVATE' },
                          ]}
                        />
                      </Form.Item>

                      <Form.Item name="featured" label={<span className="font-bold text-xs">Featured Showcase</span>} valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </div>
                  </div>
                ),
              },
              {
                key: '3',
                label: <span className="font-bold text-xs">3. Product Variants</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-semibold">
                        Add specific color, size, and SKU variations for this product.
                      </span>
                      <Button
                        type="dashed"
                        icon={<Plus className="w-3.5 h-3.5" />}
                        onClick={handleAddVariant}
                        className="font-bold text-xs"
                      >
                        Add Variant
                      </Button>
                    </div>

                    {variants.length === 0 ? (
                      <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium text-xs">
                        No variants added. Product will sell as a single standard item.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Table Column Headers */}
                        <div className="grid grid-cols-[1fr_1fr_1.4fr_1fr_1fr_40px] gap-2.5 px-4 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl text-[11px] font-black uppercase tracking-wider text-[#111827]">
                          <span>Color / Shade</span>
                          <span>Size / Volume</span>
                          <span>Variant SKU</span>
                          <span>Price ({brandConfig.currency.symbol})</span>
                          <span>Stock Qty</span>
                          <span className="text-center">Remove</span>
                        </div>

                        {variants.map((v, idx) => (
                          <div key={idx} className="p-3 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
                            <div className="grid grid-cols-[1fr_1fr_1.4fr_1fr_1fr_40px] gap-2.5 items-center">
                              <div>
                                <Input
                                  placeholder="e.g. Red / Black"
                                  value={v.color || ''}
                                  onChange={(e) => handleUpdateVariant(idx, 'color', e.target.value)}
                                  className="text-xs rounded-xl"
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="e.g. 5ml / Free Size"
                                  value={v.size || ''}
                                  onChange={(e) => handleUpdateVariant(idx, 'size', e.target.value)}
                                  className="text-xs rounded-xl"
                                />
                              </div>
                              <div>
                                <Input
                                  placeholder="e.g. SKU-001"
                                  value={v.sku || ''}
                                  onChange={(e) => handleUpdateVariant(idx, 'sku', e.target.value)}
                                  className="text-xs font-mono rounded-xl"
                                />
                              </div>
                              <div>
                                <InputNumber
                                  placeholder="0.00"
                                  value={v.price}
                                  onChange={(val) => handleUpdateVariant(idx, 'price', val)}
                                  className="w-full text-xs rounded-xl"
                                  prefix={brandConfig.currency.symbol}
                                />
                              </div>
                              <div>
                                <InputNumber
                                  placeholder="0"
                                  value={v.stock}
                                  onChange={(val) => handleUpdateVariant(idx, 'stock', val)}
                                  className="w-full text-xs rounded-xl"
                                />
                              </div>
                              <div className="flex justify-center">
                                <Button
                                  type="text"
                                  danger
                                  icon={<Trash2 className="w-4 h-4" />}
                                  onClick={() => handleRemoveVariant(idx)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: '4',
                label: <span className="font-bold text-xs">4. SEO Metadata</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item name="metaTitle" label={<span className="font-bold text-xs">Meta Title</span>}>
                      <Input placeholder="SEO Search Engine Title" className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="metaDescription" label={<span className="font-bold text-xs">Meta Description</span>}>
                      <Input.TextArea rows={3} placeholder="SEO Search Snippet Summary..." className="rounded-xl" />
                    </Form.Item>

                    <Form.Item name="metaKeywords" label={<span className="font-bold text-xs">Meta Keywords</span>}>
                      <Input placeholder="e.g. blazer, fashion, cashmere, luxury" className="rounded-xl" />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Drawer>

      {/* Bulk Target Assignment Modal */}
      <Modal
        title={`Bulk Assign ${bulkAssignModal.type === 'CATEGORY' ? 'Category' : 'Retailer'}`}
        open={bulkAssignModal.open}
        onOk={handleConfirmBulkAssign}
        onCancel={() => setBulkAssignModal({ open: false, type: 'CATEGORY' })}
      >
        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-600 font-semibold">
            Select target {bulkAssignModal.type === 'CATEGORY' ? 'category' : 'retailer'} to assign to all {selectedRowKeys.length} selected products:
          </p>

          {bulkAssignModal.type === 'CATEGORY' ? (
            <Select
              className="w-full"
              placeholder="Select Category"
              value={bulkTargetId}
              onChange={(val) => setBulkTargetId(val)}
              options={categories?.map((c) => ({ label: c.name, value: c.id }))}
            />
          ) : (
            <Select
              className="w-full"
              placeholder="Select Retailer"
              value={bulkTargetId}
              onChange={(val) => setBulkTargetId(val)}
              options={brands?.map((b) => ({ label: b.name, value: b.id }))}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
