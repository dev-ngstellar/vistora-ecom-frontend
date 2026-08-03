'use client';

import React, { useState } from 'react';
import { useBrands, useBrandMutations } from '@/hooks/use-catalogue';
import { Brand } from '@/types/catalogue.types';
import { Table, Modal, Form, Input, Select, Button, Tag, Space, Avatar } from 'antd';
import { Plus, Edit, Trash2, Award, ExternalLink } from 'lucide-react';

export default function AdminBrandsPage() {
  const { data: brands, isLoading } = useBrands();
  const { createBrand, updateBrand, deleteBrand } = useBrandMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      form.setFieldsValue({
        name: brand.name,
        slug: brand.slug,
        logoUrl: brand.logoUrl,
        description: brand.description,
        website: brand.website,
        status: brand.status,
      });
    } else {
      setEditingBrand(null);
      form.resetFields();
      form.setFieldsValue({ status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: Partial<Brand>) => {
    if (editingBrand) {
      await updateBrand.mutateAsync({ id: editingBrand.id, data: values });
    } else {
      await createBrand.mutateAsync(values);
    }
    setIsModalOpen(false);
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
      title: 'Brand Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Brand) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.logoUrl}
            icon={<Award className="w-4 h-4 text-indigo-600" />}
            className="bg-slate-100 border border-slate-200"
          />
          <div>
            <span className="font-bold text-slate-900 block">{text}</span>
            <span className="text-xs text-slate-400 font-mono">/brands/{record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Website',
      dataIndex: 'website',
      key: 'website',
      render: (website: string | null) =>
        website ? (
          <a
            href={website}
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
        <Tag color={status === 'ACTIVE' ? 'green' : 'volcano'}>{status}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Edit className="w-4 h-4 text-indigo-600" />}
            onClick={() => handleOpenModal(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Brand Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Luxury Brands</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600"
        >
          Add Brand
        </Button>
      </div>

      {/* Brands Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <Table
          dataSource={brands}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingBrand ? 'Edit Brand' : 'Create New Brand'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createBrand.isPending || updateBrand.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
          <Form.Item
            name="name"
            label="Brand Name"
            rules={[{ required: true, message: 'Please enter brand name' }]}
          >
            <Input placeholder="e.g. Gucci" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (Optional)">
            <Input placeholder="Auto-generated if left blank" />
          </Form.Item>

          <Form.Item name="logoUrl" label="Logo URL">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item name="website" label="Official Website URL">
            <Input placeholder="https://www.brand.com" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Brand story..." />
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="ACTIVE">Active</Select.Option>
              <Select.Option value="INACTIVE">Inactive</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
