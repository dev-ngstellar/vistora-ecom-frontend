'use client';

import React, { useState } from 'react';
import { useBrands, useCategories, useCollections, useProductMutations, useProducts } from '@/hooks/use-catalogue';
import { Product } from '@/types/catalogue.types';
import { Table, Modal, Form, Input, Select, InputNumber, Button, Tag, Space, Avatar, Drawer, Switch } from 'antd';
import { Plus, Edit, Trash2, Copy, ShoppingBag, Search, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const [query, setQuery] = useState<{ q?: string; categoryId?: string; page: number }>({ page: 1 });
  const { data: productsData, isLoading } = useProducts({ page: query.page, limit: 10, q: query.q, categoryId: query.categoryId });
  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: collections } = useCollections();

  const { createProduct, updateProduct, deleteProduct, duplicateProduct } = useProductMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const products = productsData?.items || [];
  const meta = productsData?.meta || { total: 0, page: 1, limit: 10, totalPages: 1 };

  const handleOpenDrawer = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      form.setFieldsValue({
        name: product.name,
        slug: product.slug,
        sku: product.sku,
        categoryId: product.categoryId,
        brandId: product.brandId,
        collectionId: product.collectionId,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        costPrice: product.costPrice,
        shortDescription: product.shortDescription,
        description: product.description,
        status: product.status,
        visibility: product.visibility,
        featured: product.featured,
      });
    } else {
      setEditingProduct(null);
      form.resetFields();
      form.setFieldsValue({
        status: 'ACTIVE',
        visibility: 'PUBLIC',
        featured: false,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    const payload: Record<string, any> = {};
    Object.keys(values).forEach((key) => {
      const val = values[key];
      payload[key] = val === '' ? null : val;
    });

    if (editingProduct) {
      await updateProduct.mutateAsync({ id: editingProduct.id, data: payload as Partial<Product> });
    } else {
      await createProduct.mutateAsync(payload as Partial<Product>);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Product',
      content: 'Are you sure you want to soft delete this product from catalog?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteProduct.mutate(id),
    });
  };

  const handleDuplicate = (product: Product) => {
    Modal.confirm({
      title: 'Duplicate Product',
      content: `Create a draft clone of "${product.name}"?`,
      okText: 'Duplicate',
      onOk: () => duplicateProduct.mutate(product),
    });
  };

  const columns = [
    {
      title: 'Product Info',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Product) => {
        const image = record.images?.[0]?.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100';
        return (
          <div className="flex items-center gap-3">
            <Avatar src={image} shape="square" size={48} className="rounded-xl border border-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 block">{text}</span>
                {record.featured && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    Featured
                  </span>
                )}
              </div>
              <span className="text-xs text-slate-400 font-mono">SKU: {record.sku}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (cat: any) => <span className="text-xs font-semibold text-slate-700">{cat?.name || 'N/A'}</span>,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number, record: Product) => (
        <div>
          <span className="font-extrabold text-slate-900">${Number(price).toFixed(2)}</span>
          {record.compareAtPrice && (
            <span className="text-xs text-slate-400 line-through block">
              ${Number(record.compareAtPrice).toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ACTIVE: 'green',
          DRAFT: 'orange',
          OUT_OF_STOCK: 'red',
          INACTIVE: 'volcano',
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>Catalogue Operations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Products Management</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenDrawer()}
          className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600"
        >
          Create Product
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by product name or SKU..."
          prefix={<Search className="w-4 h-4 text-slate-400" />}
          value={query.q || ''}
          onChange={(e) => setQuery((prev) => ({ ...prev, q: e.target.value, page: 1 }))}
          className="rounded-xl max-w-sm"
          allowClear
        />

        <Select
          placeholder="Filter by Category"
          value={query.categoryId}
          onChange={(val) => setQuery((prev) => ({ ...prev, categoryId: val, page: 1 }))}
          className="w-48"
          allowClear
        >
          {categories?.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.name}
            </Select.Option>
          ))}
        </Select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <Table
          dataSource={products}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: meta.page,
            total: meta.total,
            pageSize: meta.limit,
            onChange: (p) => setQuery((prev) => ({ ...prev, page: p })),
          }}
        />
      </div>

      {/* Product Drawer Form */}
      <Drawer
        title={editingProduct ? 'Edit Product' : 'Create New Product'}
        size={560}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={createProduct.isPending || updateProduct.isPending}
            className="bg-slate-900"
          >
            Save Product
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} preserve={false}>
          <Form.Item
            name="name"
            label="Product Title"
            rules={[{ required: true, message: 'Please enter product title' }]}
          >
            <Input placeholder="e.g. Italian Silk Evening Gown" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="sku"
              label="SKU Code"
              rules={[{ required: true, message: 'Please enter SKU' }]}
            >
              <Input placeholder="e.g. VIS-DRS-001" />
            </Form.Item>

            <Form.Item
              name="categoryId"
              label="Category"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select placeholder="Select Category">
                {categories?.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="brandId" label="Brand">
              <Select placeholder="Select Brand (Optional)" allowClear>
                {brands?.map((b) => (
                  <Select.Option key={b.id} value={b.id}>
                    {b.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="collectionId" label="Collection">
              <Select placeholder="Select Collection (Optional)" allowClear>
                {collections?.map((col) => (
                  <Select.Option key={col.id} value={col.id}>
                    {col.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="price"
              label="Retail Price ($)"
              rules={[{ required: true, message: 'Price is required' }]}
            >
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>

            <Form.Item name="compareAtPrice" label="Compare Price ($)">
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>

            <Form.Item name="costPrice" label="Cost Price ($)">
              <InputNumber min={0} precision={2} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="shortDescription" label="Short Summary">
            <Input.TextArea rows={2} placeholder="Brief product summary..." />
          </Form.Item>

          <Form.Item name="description" label="Full Editorial Description">
            <Input.TextArea rows={4} placeholder="Full product story..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label="Publication Status">
              <Select>
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="DRAFT">Draft</Select.Option>
                <Select.Option value="OUT_OF_STOCK">Out of Stock</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="featured" label="Featured Showcase" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
