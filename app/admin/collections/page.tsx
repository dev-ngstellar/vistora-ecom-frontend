'use client';

import React, { useState } from 'react';
import { useCollections, useCollectionMutations } from '@/hooks/use-catalogue';
import { Collection } from '@/types/catalogue.types';
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
} from 'antd';
import { Plus, Edit, Trash2, Sparkles, Search, RefreshCw } from 'lucide-react';

export default function AdminCollectionsPage() {
  const { data: collections = [], isLoading, refetch } = useCollections();
  const { createCollection, updateCollection, deleteCollection } = useCollectionMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form] = Form.useForm();

  const filteredCollections = collections.filter(
    (cl) =>
      cl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cl.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (collection?: Collection) => {
    if (collection) {
      setEditingCollection(collection);
      setBannerImage(collection.bannerImage || null);
      form.setFieldsValue({
        name: collection.name,
        slug: collection.slug,
        description: collection.description,
        status: collection.status,
      });
    } else {
      setEditingCollection(null);
      setBannerImage(null);
      form.resetFields();
      form.setFieldsValue({ status: 'ACTIVE' });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: Partial<Collection>) => {
    const payload = {
      ...values,
      bannerImage: bannerImage || null,
    };

    if (editingCollection) {
      await updateCollection.mutateAsync({ id: editingCollection.id, data: payload });
    } else {
      await createCollection.mutateAsync(payload);
    }
    setIsDrawerOpen(false);
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
      title: 'Collection Showcase',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Collection) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.bannerImage}
            icon={<Sparkles className="w-4 h-4 text-amber-500" />}
            shape="square"
            size={52}
            className="rounded-2xl border border-slate-200 shrink-0 bg-slate-50"
          />
          <div>
            <span className="font-bold text-slate-900 block">{text}</span>
            <span className="text-xs text-slate-400 font-mono">/collections/{record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc: string | null) => (
        <span className="text-xs text-slate-600 font-medium line-clamp-1 max-w-xs">
          {desc || '—'}
        </span>
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
      render: (_: any, record: Collection) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Edit className="w-4 h-4 text-indigo-600" />}
            title="Edit Collection"
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Collection"
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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Seasonal Lookbooks</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Collections Showcase</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create editorial runway collections and seasonal lookbooks with high-res banner media.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenDrawer()}
          className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600 h-11 px-5"
        >
          Create Collection
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
            placeholder="Search collection name or slug..."
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-600"
          />
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <Table
          columns={columns}
          dataSource={filteredCollections}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Collection Create / Edit Drawer */}
      <Drawer
        title={editingCollection ? `Edit Collection: ${editingCollection.name}` : 'Create Collection'}
        styles={{ wrapper: { width: '500px', maxWidth: '100vw' } }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="font-bold bg-slate-900 hover:bg-indigo-600"
          >
            {editingCollection ? 'Save Collection' : 'Create Collection'}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4 pt-2">
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs">Collection Name</span>}
            rules={[{ required: true, message: 'Collection name is required' }]}
          >
            <Input placeholder="e.g. Autumn Winter 2026 Lookbook" className="rounded-xl" />
          </Form.Item>

          <Form.Item name="slug" label={<span className="font-bold text-xs">URL Slug</span>}>
            <Input placeholder="auto-generated-if-empty" className="rounded-xl font-mono" />
          </Form.Item>

          {/* Shared Media Upload for Banner Image */}
          <div>
            <label className="font-bold text-xs block mb-2">Collection Banner Media</label>
            <MediaUpload
              multiple={false}
              value={bannerImage || undefined}
              onChange={(val) => setBannerImage(val || null)}
            />
          </div>

          <Form.Item name="description" label={<span className="font-bold text-xs">Editorial Summary</span>}>
            <Input.TextArea rows={3} placeholder="Collection editorial text for catalog hero banner..." className="rounded-xl" />
          </Form.Item>

          <Form.Item name="status" label={<span className="font-bold text-xs">Publication Status</span>}>
            <Select
              options={[
                { label: 'Active', value: 'ACTIVE' },
                { label: 'Inactive', value: 'INACTIVE' },
              ]}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}
