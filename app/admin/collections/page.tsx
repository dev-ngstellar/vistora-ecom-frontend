'use client';

import React, { useState } from 'react';
import { useCollections, useCollectionMutations } from '@/hooks/use-catalogue';
import { Collection } from '@/types/catalogue.types';
import { Table, Modal, Form, Input, Select, Button, Tag, Space, Avatar } from 'antd';
import { Plus, Edit, Trash2, Sparkles } from 'lucide-react';

export default function AdminCollectionsPage() {
  const { data: collections, isLoading } = useCollections();
  const { createCollection, updateCollection, deleteCollection } = useCollectionMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [form] = Form.useForm();

  const handleOpenModal = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      form.setFieldsValue({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        bannerImage: collection.bannerImage,
        status: collection.status,
      });
    } else {
      setEditingCollection(null);
      form.resetFields();
      form.setFieldsValue({ status: 'ACTIVE' });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: Partial<Collection>) => {
    if (editingCollection) {
      await updateCollection.mutateAsync({ id: editingCollection.id, data: values });
    } else {
      await createCollection.mutateAsync(values);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Collection',
      content: 'Are you sure you want to soft delete this collection?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteCollection.mutate(id),
    });
  };

  const columns = [
    {
      title: 'Collection Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Collection) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.bannerImage}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            shape="square"
            size="large"
            className="rounded-xl border border-slate-200"
          />
          <div>
            <span className="font-bold text-slate-900 block">{text}</span>
            <span className="text-xs text-slate-400 font-mono">/collections/{record.slug}</span>
          </div>
        </div>
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
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-slate-500">
          {new Date(date).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Collection) => (
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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Seasonal Showcase</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Runway Collections</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600"
        >
          Add Collection
        </Button>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <Table
          dataSource={collections}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Modal */}
      <Modal
        title={editingCollection ? 'Edit Collection' : 'Create New Collection'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createCollection.isPending || updateCollection.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
          <Form.Item
            name="name"
            label="Collection Name"
            rules={[{ required: true, message: 'Please enter collection name' }]}
          >
            <Input placeholder="e.g. Autumn Winter 2026 Lookbook" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (Optional)">
            <Input placeholder="Auto-generated if left blank" />
          </Form.Item>

          <Form.Item name="bannerImage" label="Banner Image URL">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Collection editorial description..." />
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
