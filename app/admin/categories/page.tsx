'use client';

import React, { useState } from 'react';
import { useCategories, useCategoryMutations, useCategoryTree } from '@/hooks/use-catalogue';
import { Category } from '@/types/catalogue.types';
import { Table, Modal, Form, Input, Select, InputNumber, Button, Tag, Space, Drawer, Tree } from 'antd';
import { Plus, Edit, Trash2, FolderTree, RefreshCw, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categories, isLoading, refetch } = useCategories();
  const { data: categoryTree } = useCategoryTree();
  const { createCategory, updateCategory, deleteCategory } = useCategoryMutations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isTreeDrawerOpen, setIsTreeDrawerOpen] = useState(false);
  const [form] = Form.useForm();

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        parentId: category.parentId,
        description: category.description,
        imageUrl: category.imageUrl,
        status: category.status,
        sortOrder: category.sortOrder,
      });
    } else {
      setEditingCategory(null);
      form.resetFields();
      form.setFieldsValue({ status: 'ACTIVE', sortOrder: 0 });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: Partial<Category>) => {
    if (editingCategory) {
      await updateCategory.mutateAsync({ id: editingCategory.id, data: values });
    } else {
      await createCategory.mutateAsync(values);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Category',
      content: 'Are you sure you want to delete this category? This will soft delete the record.',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteCategory.mutate(id),
    });
  };

  // Convert CategoryTree to Ant Design Tree Data format
  const mapTreeData = (items: typeof categoryTree = []): any[] => {
    return items.map((item) => ({
      title: (
        <span className="font-semibold text-slate-800">
          {item.name} <span className="text-xs text-slate-400 font-mono">({item.slug})</span>
        </span>
      ),
      key: item.id,
      children: item.children ? mapTreeData(item.children) : [],
    }));
  };

  const columns = [
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Category) => (
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block">{text}</span>
            <span className="text-xs text-slate-400 font-mono">/categories/{record.slug}</span>
          </div>
        </div>
      ),
    },
    {
      title: 'Parent Category',
      dataIndex: 'parentId',
      key: 'parentId',
      render: (parentId: string | null) => {
        const parent = categories?.find((c) => c.id === parentId);
        return parent ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            {parent.name}
          </span>
        ) : (
          <span className="text-xs text-slate-400">— Top Level</span>
        );
      },
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
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Category) => (
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Taxonomy Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Store Categories</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            icon={<FolderTree className="w-4 h-4" />}
            onClick={() => setIsTreeDrawerOpen(true)}
            className="rounded-2xl font-semibold"
          >
            Tree Hierarchy
          </Button>

          <Button
            type="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => handleOpenModal()}
            className="rounded-2xl font-bold bg-slate-900 hover:bg-indigo-600"
          >
            Add Category
          </Button>
        </div>
      </div>

      {/* Category Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{ pageSize: 10 }}
        />
      </div>

      {/* Create / Edit Category Modal */}
      <Modal
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={createCategory.isPending || updateCategory.isPending}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="mt-4">
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="e.g. Women's Outerwear" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (Optional)">
            <Input placeholder="Auto-generated if left blank" />
          </Form.Item>

          <Form.Item name="parentId" label="Parent Category">
            <Select placeholder="Select Parent Category (Optional)" allowClear>
              {categories
                ?.filter((c) => c.id !== editingCategory?.id)
                .map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Category description..." />
          </Form.Item>

          <Form.Item name="imageUrl" label="Banner Image URL">
            <Input placeholder="https://images.unsplash.com/..." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="status" label="Status">
              <Select>
                <Select.Option value="ACTIVE">Active</Select.Option>
                <Select.Option value="INACTIVE">Inactive</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="sortOrder" label="Sort Order">
              <InputNumber min={0} className="w-full" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      {/* Tree Hierarchy Drawer */}
      <Drawer
        title="Category Hierarchy Tree"
        placement="right"
        onClose={() => setIsTreeDrawerOpen(false)}
        open={isTreeDrawerOpen}
        width={400}
      >
        {categoryTree && categoryTree.length > 0 ? (
          <Tree treeData={mapTreeData(categoryTree)} defaultExpandAll />
        ) : (
          <p className="text-slate-400 text-sm">No category tree nodes available.</p>
        )}
      </Drawer>
    </div>
  );
}
