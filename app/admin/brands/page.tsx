'use client';

import React, { useState } from 'react';
import { useBrands, useBrandMutations } from '@/hooks/use-catalogue';
import { Brand } from '@/types/catalogue.types';
import { MediaUpload } from '@/components/ui/media-upload';
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Avatar,
  Drawer,
  Switch,
} from 'antd';
import {
  Plus,
  Edit,
  Trash2,
  Award,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export default function AdminBrandsPage() {
  const { data: brands = [], isLoading, refetch } = useBrands();
  const { createBrand, updateBrand, deleteBrand } = useBrandMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form] = Form.useForm();

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setLogoUrl(brand.logoUrl || null);
      form.setFieldsValue({
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        website: brand.website,
        featured: brand.featured ?? false,
        status: brand.status,
      });
    } else {
      setEditingBrand(null);
      setLogoUrl(null);
      form.resetFields();
      form.setFieldsValue({
        status: 'ACTIVE',
        featured: false,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: Record<string, any>) => {
    const payload: Partial<Brand> = {
      name: values.name,
      slug: values.slug,
      description: values.description || null,
      website: values.website || null,
      logoUrl: logoUrl || null,
      featured: values.featured ?? false,
      status: values.status,
    };

    if (editingBrand) {
      await updateBrand.mutateAsync({ id: editingBrand.id, data: payload });
    } else {
      await createBrand.mutateAsync(payload);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Brand',
      content: 'Are you sure you want to soft delete this brand?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteBrand.mutate(id),
    });
  };

  const columns = [
    {
      title: 'Brand Details',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Brand) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.logoUrl}
            icon={<Award className="w-4 h-4 text-indigo-600" />}
            size={48}
            className="bg-slate-50 border border-slate-200 shrink-0 rounded-2xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 block">{text}</span>
              {record.featured && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-600" /> Featured
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-mono">/brands/{record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Official Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string | null) =>
        website ? (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-indigo-600 flex items-center gap-1 hover:underline"
          >
            <span>{website.replace(/^https?:\/\//, '')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs text-slate-400">—</span>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'} className="font-bold rounded-full px-2.5">
          {status}
        </Tag>
      ),
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
      render: (_: any, record: Brand) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Edit className="w-4 h-4 text-indigo-600" />}
            title="Edit Brand"
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Brand"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Brand Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Brands Catalogue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage partner luxury brands, logos, official web destinations, and featured brand showcases.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenDrawer()}
          className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600 h-11 px-5"
        >
          Create Brand
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search brand name or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredBrands}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Brand Create / Edit Drawer */}
      <Drawer
        title={editingBrand ? `Edit Brand: ${editingBrand.name}` : 'Create Brand'}
        styles={{ wrapper: { width: '500px', maxWidth: '100vw' } }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="font-bold bg-slate-900 hover:bg-indigo-600"
          >
            {editingBrand ? 'Save Brand' : 'Create Brand'}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4 pt-2">
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs">Brand Name</span>}
            rules={[{ required: true, message: 'Brand name is required' }]}
          >
            <Input placeholder="e.g. Vistora Studio" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="slug" label={<span className="font-bold text-xs">URL Slug</span>}>
            <Input placeholder="auto-generated-if-empty" className="rounded-xl font-mono" />
          </Form.Item>

          {/* Shared Media Upload for Brand Logo */}
          <div>
            <label className="font-bold text-xs block mb-2">Brand Logo Image</label>
            <MediaUpload
              multiple={false}
              value={logoUrl || undefined}
              onChange={(val) => setLogoUrl(val || null)}
            />
          </div>

          <Form.Item name="website" label={<span className="font-bold text-xs">Official Website URL</span>}>
            <Input placeholder="https://www.branddomain.com" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="description" label={<span className="font-bold text-xs">Brand Description</span>}>
            <Input.TextArea rows={3} placeholder="Editorial summary of brand heritage and aesthetic..." className="rounded-xl" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <Form.Item name="status" label={<span className="font-bold text-xs">Publication Status</span>}>
              <Select
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
            </Form.Item>

            <Form.Item name="featured" label={<span className="font-bold text-xs">Featured Brand</span>} valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
