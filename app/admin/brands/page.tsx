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
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import { TableToolbar } from '@/components/admin/table-toolbar';

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
      title: 'Delete Retailer',
      content: 'Are you sure you want to soft delete this retailer?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteBrand.mutate(id),
    });
  };

  const columns = [
    {
      title: 'Retailer Details',
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
            title="Edit Retailer"
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Retailer"
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5 pb-8">
      {/* Page Header */}
      <PageHeader
        title="Retailers"
        subtitle="Manage partner retailers, merchant logos, official web destinations, and featured partner showcases."
        action={
          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenDrawer()}
            className="rounded-lg font-bold bg-[#A50025] hover:bg-[#7D001C] text-white h-9 px-4 text-xs"
          >
            Create Retailer
          </Button>
        }
        toolbar={
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={(val) => setSearchTerm(val)}
            searchPlaceholder="Search retailer name or slug..."
            onReset={() => setSearchTerm('')}
          />
        }
      />

      {/* Brands Table */}
      <AdminCard headerBorder={false} className="p-0">
        <Table
          columns={columns}
          dataSource={filteredBrands}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 12 }}
        />
      </AdminCard>

      {/* Brand Create / Edit Drawer */}
      <Drawer
        title={editingBrand ? `Edit Retailer: ${editingBrand.name}` : 'Create Retailer'}
        styles={{ wrapper: { width: '500px', maxWidth: '100vw' } }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="font-bold bg-slate-900 hover:bg-indigo-600"
          >
            {editingBrand ? 'Save Retailer' : 'Create Retailer'}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4 pt-2">
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs">Retailer Name</span>}
            rules={[{ required: true, message: 'Retailer name is required' }]}
          >
            <Input placeholder="e.g. Vistora Merchant Studio" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="slug" label={<span className="font-bold text-xs">URL Slug</span>}>
            <Input placeholder="auto-generated-if-empty" className="rounded-xl font-mono" />
          </Form.Item>

          {/* Shared Media Upload for Brand Logo */}
          <div>
            <label className="font-bold text-xs block mb-2">Retailer Logo Image</label>
            <MediaUpload
              multiple={false}
              value={logoUrl || undefined}
              onChange={(val) => setLogoUrl(val || null)}
            />
          </div>

          <Form.Item name="website" label={<span className="font-bold text-xs">Official Website URL</span>}>
            <Input placeholder="https://www.retailerdomain.com" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="description" label={<span className="font-bold text-xs">Retailer Description</span>}>
            <Input.TextArea rows={3} placeholder="Editorial summary of retailer partner profile and products..." className="rounded-xl" />
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

            <Form.Item name="featured" label={<span className="font-bold text-xs">Featured Retailer</span>} valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
        </Form>
      </Drawer>
    </div>
  );
}
