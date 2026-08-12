'use client';

import React, { useState } from 'react';
import { useCategories, useCategoryMutations, useCategoryTree } from '@/hooks/use-catalogue';
import { Category } from '@/types/catalogue.types';
import { MediaUpload } from '@/components/ui/media-upload';
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
  Tree,
  Card,
  Avatar,
} from 'antd';
import {
  Plus,
  Edit,
  Trash2,
  FolderTree,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';
import { PageHeader } from '@/components/admin/page-header';
import { AdminCard } from '@/components/admin/admin-card';
import { TableToolbar } from '@/components/admin/table-toolbar';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, refetch } = useCategories();
  const { data: categoryTree = [] } = useCategoryTree();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isTreeDrawerOpen, setIsTreeDrawerOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [form] = Form.useForm();

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDrawer = (category?: Category, parentId?: string) => {
    if (category) {
      setEditingCategory(category);
      setImageUrl(category.imageUrl || null);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        description: category.description,
        status: category.status,
        sortOrder: category.sortOrder,
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
      });
    } else {
      setEditingCategory(null);
      setImageUrl(null);
      form.resetFields();
      form.setFieldsValue({
        parentId: parentId || null,
        status: 'ACTIVE',
        sortOrder: 0,
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: Partial<Category>) => {
    const payload = {
      ...values,
      imageUrl: imageUrl || null,
    };

    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data: payload });
    } else {
      await createCategory.mutateAsync(payload);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to soft delete this category?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteCategory.mutate(id),
    });
  };

  // Convert CategoryTree to Ant Design Tree Data format
  const mapTreeData = (items: typeof categoryTree = []): any[] => {
    return items.map((item) => ({
      title: (
        <div className="flex items-center justify-between gap-4 py-1">
          <span className="font-semibold text-slate-800 text-xs">
            {item.name} <span className="text-[11px] text-slate-400 font-mono">({item.slug})</span>
          </span>
          <Button
            size="small"
            type="text"
            icon={<Plus className="w-3 h-3 text-indigo-600" />}
            onClick={(e) => {
              e.stopPropagation();
              handleOpenDrawer(undefined, item.id);
            }}
          >
            Add Child
          </Button>
        </div>
      ),
      key: item.id,
      children: item.children ? mapTreeData(item.children) : [],
    }));
  };

  const columns = [
    {
      title: 'Category Details',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <div className="flex items-center gap-3">
          <Avatar
            src={record.imageUrl}
            icon={<Layers className="w-4 h-4 text-indigo-600" />}
            shape="square"
            size={48}
            className="rounded-2xl border border-slate-200 shrink-0 bg-slate-50"
          />
          <div>
            <span className="font-bold text-slate-900 block">{text}</span>
            <span className="text-xs text-slate-400 font-mono">/categories/{record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Hierarchy Level',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string | null) => {
        const parent = categories.find((c) => c.id === parentId);
        return parent ? (
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
            Child of: {parent.name}
          </span>
        ) : (
          <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider px-2.5 py-1 rounded-full bg-slate-100">
            Top Level Root
          </span>
        );
      },
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      render: (order: number) => (
        <span className="text-xs font-mono font-bold text-slate-700">{order}</span>
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
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Category) => (
        <Space size="small">
          <Button
            type="text"
            icon={<Plus className="w-4 h-4 text-indigo-600" />}
            title="Add Sub-category"
            onClick={() => handleOpenDrawer(undefined, record.id)}
          />
          <Button
            type="text"
            icon={<Edit className="w-4 h-4 text-slate-600" />}
            title="Edit Category"
            onClick={() => handleOpenDrawer(record)}
          />
          <Button
            type="text"
            danger
            icon={<Trash2 className="w-4 h-4" />}
            title="Delete Category"
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
        title="Categories"
        subtitle="Organize catalog products into hierarchical parent and sub-categories."
        action={
          <div className="flex items-center gap-2">
            <Button
              icon={<FolderTree className="w-4 h-4" />}
              onClick={() => setIsTreeDrawerOpen(true)}
              className="rounded-lg font-bold text-xs h-9"
            >
              Tree Hierarchy View
            </Button>
            <Button
              type="primary"
              icon={<Plus className="w-4 h-4" />}
              onClick={() => handleOpenDrawer()}
              className="rounded-lg font-bold bg-[#A50025] hover:bg-[#7D001C] text-white h-9 px-4 text-xs"
            >
              Create Category
            </Button>
          </div>
        }
        toolbar={
          <TableToolbar
            searchValue={searchTerm}
            onSearchChange={(val) => setSearchTerm(val)}
            searchPlaceholder="Search category name or slug..."
            onReset={() => setSearchTerm('')}
          />
        }
      />

      {/* Categories Table */}
      <AdminCard headerBorder={false} className="p-0">
        <Table
          columns={columns}
          dataSource={filteredCategories}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 12 }}
        />
      </AdminCard>

      {/* Category Create / Edit Drawer */}
      <Drawer
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category'}
        styles={{ wrapper: { width: '560px', maxWidth: '100vw' } }}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            className="font-bold bg-slate-900 hover:bg-indigo-600"
          >
            {editingCategory ? 'Save Category' : 'Create Category'}
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4 pt-2">
          <Form.Item
            name="name"
            label={<span className="font-bold text-xs">Category Name</span>}
            rules={[{ required: true, message: 'Category name is required' }]}
          >
            <Input placeholder="e.g. Outerwear & Coats" className="rounded-xl" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="slug" label={<span className="font-bold text-xs">URL Slug</span>}>
              <Input placeholder="auto-generated-if-empty" className="rounded-xl font-mono" />
            </Form.Item>

            <Form.Item name="parentId" label={<span className="font-bold text-xs">Parent Category</span>}>
              <Select
                allowClear
                placeholder="Top Level (No Parent)"
                options={categories
                  .filter((c) => c.id !== editingCategory?.id)
                  .map((c) => ({ label: c.name, value: c.id }))}
              />
            </Form.Item>
          </div>

          {/* Shared Media Upload for Category Image */}
          <div>
            <label className="font-bold text-xs block mb-2">Category Cover Image</label>
            <MediaUpload
              multiple={false}
              value={imageUrl || undefined}
              onChange={(val) => setImageUrl(val || null)}
            />
          </div>

          <Form.Item name="description" label={<span className="font-bold text-xs">Category Description</span>}>
            <Input.TextArea rows={3} placeholder="Brief editorial description for category landing page..." className="rounded-xl" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label={<span className="font-bold text-xs">Category Status</span>}>
              <Select
                options={[
                  { label: 'Active', value: 'ACTIVE' },
                  { label: 'Inactive', value: 'INACTIVE' },
                ]}
              />
            </Form.Item>

            <Form.Item name="sortOrder" label={<span className="font-bold text-xs">Sort Order Position</span>}>
              <InputNumber min={0} className="w-full rounded-xl" />
            </Form.Item>
          </div>

          <div className="border-t border-slate-200 pt-4 space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">Category SEO Settings</span>

            <Form.Item name="metaTitle" label={<span className="font-bold text-xs">SEO Meta Title</span>}>
              <Input placeholder="Category Search Engine Title" className="rounded-xl" />
            </Form.Item>

            <Form.Item name="metaDescription" label={<span className="font-bold text-xs">SEO Meta Description</span>}>
              <Input.TextArea rows={2} placeholder="Meta description for search engine results..." className="rounded-xl" />
            </Form.Item>
          </div>
        </Form>
      </Drawer>

      {/* Category Tree Hierarchy View Drawer */}
      <Drawer
        title="Category Tree Hierarchy"
        styles={{ wrapper: { width: '480px', maxWidth: '100vw' } }}
        open={isTreeDrawerOpen}
        onClose={() => setIsTreeDrawerOpen(false)}
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Visual tree overview showing nested parent and child relationships.
          </p>

          {categoryTree.length > 0 ? (
            <Tree treeData={mapTreeData(categoryTree)} defaultExpandAll className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs" />
          ) : (
            <div className="p-8 text-center text-xs text-slate-400 font-semibold border border-dashed border-slate-200 rounded-2xl">
              No categories defined.
            </div>
          )}
        </div>
      </Drawer>
    </div>
  );
}
