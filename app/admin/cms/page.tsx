'use client';

import React, { useState } from 'react';
import { useCMSMutations, useCMSPages } from '@/hooks/use-content';
import { CMSPage } from '@/types/content.types';
import { RichTextEditor } from '@/components/content/rich-text-editor';
import { CMSPreviewModal } from '@/components/content/cms-preview-modal';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Form,
  Tag,
  Dropdown,
  Tabs,
  Space,
  Card,
} from 'antd';
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  MoreHorizontal,
  Globe,
  CheckCircle,
  Clock,
  Shield,
  HelpCircle,
  FileCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import dayjs from 'dayjs';

const DEFAULT_PAGES = [
  { slug: 'about-us', title: 'About Us', icon: FileCheck, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
  { slug: 'contact-us', title: 'Contact Us', icon: Globe, color: 'text-blue-600 bg-blue-50 border-blue-100' },
  { slug: 'privacy-policy', title: 'Privacy Policy', icon: Shield, color: 'text-purple-600 bg-purple-50 border-purple-100' },
  { slug: 'terms-and-conditions', title: 'Terms & Conditions', icon: FileText, color: 'text-cyan-600 bg-cyan-50 border-cyan-100' },
  { slug: 'refund-policy', title: 'Refund Policy', icon: RotateCcw, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  { slug: 'shipping-policy', title: 'Shipping Policy', icon: Truck, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  { slug: 'faq', title: 'FAQ', icon: HelpCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
];

export default function AdminCMSPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CMSPage | null>(null);

  const [previewPage, setPreviewPage] = useState<CMSPage | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [form] = Form.useForm();

  const { data: pagesData, isLoading: isPagesLoading } = useCMSPages({
    search: search || undefined,
    status: statusFilter,
    page,
    limit,
  });

  const { createPage, updatePage, updateStatus, deletePage } = useCMSMutations();

  const handleOpenDrawer = (pageRecord?: CMSPage) => {
    if (pageRecord) {
      setEditingPage(pageRecord);
      form.setFieldsValue({
        title: pageRecord.title,
        slug: pageRecord.slug,
        content: pageRecord.content,
        metaTitle: pageRecord.metaTitle,
        metaDescription: pageRecord.metaDescription,
        metaKeywords: pageRecord.metaKeywords,
        status: pageRecord.status,
      });
    } else {
      setEditingPage(null);
      form.resetFields();
      form.setFieldsValue({
        status: 'DRAFT',
      });
    }
    setIsDrawerOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    if (editingPage) {
      await updatePage.mutateAsync({ id: editingPage.id, data: values });
    } else {
      await createPage.mutateAsync(values);
    }
    setIsDrawerOpen(false);
    form.resetFields();
  };

  const handleTogglePublish = (pageRecord: CMSPage) => {
    const newStatus = pageRecord.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    updateStatus.mutate({ id: pageRecord.id, status: newStatus });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete CMS Page',
      content: 'Are you sure you want to delete this static page?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deletePage.mutate(id),
    });
  };

  const handleOpenPreview = (pageRecord: CMSPage) => {
    setPreviewPage(pageRecord);
    setIsPreviewOpen(true);
  };

  const handleSelectDefaultPageCard = (slug: string) => {
    const existing = pagesData?.pages.find((p) => p.slug === slug);
    if (existing) {
      handleOpenDrawer(existing);
    } else {
      const def = DEFAULT_PAGES.find((d) => d.slug === slug);
      setEditingPage(null);
      form.resetFields();
      form.setFieldsValue({
        title: def?.title || '',
        slug,
        status: 'PUBLISHED',
        content: `<h2>${def?.title}</h2><p>Provide detailed content for ${def?.title} here.</p>`,
      });
      setIsDrawerOpen(true);
    }
  };

  const columns = [
    {
      title: 'Page Title & Slug',
      dataIndex: 'title',
      key: 'title',
      render: (title: string, record: CMSPage) => (
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <button
              onClick={() => handleOpenDrawer(record)}
              className="font-extrabold text-slate-900 dark:text-white hover:underline text-left block text-xs"
            >
              {title}
            </button>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
              /{record.slug}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'SEO Title',
      dataIndex: 'metaTitle',
      key: 'metaTitle',
      render: (meta: string | null) => (
        <span className="text-xs text-slate-600 dark:text-slate-300 font-medium line-clamp-1">
          {meta || 'Not Configured'}
        </span>
      ),
    },
    {
      title: 'Publication Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'PUBLISHED' ? 'green' : 'orange'} className="font-bold rounded-lg border-0 text-xs">
          {status}
        </Tag>
      ),
    },
    {
      title: 'Published Date',
      dataIndex: 'publishedAt',
      key: 'publishedAt',
      render: (date: string | null) => (
        <span className="text-xs text-slate-500 font-medium">
          {date ? dayjs(date).format('MMM D, YYYY') : 'Draft'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CMSPage) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'preview',
                icon: <Eye className="w-4 h-4 text-indigo-600" />,
                label: 'Live Webpage Preview',
                onClick: () => handleOpenPreview(record),
              },
              {
                key: 'edit',
                icon: <Edit className="w-4 h-4 text-emerald-600" />,
                label: 'Edit Content',
                onClick: () => handleOpenDrawer(record),
              },
              {
                key: 'toggle_status',
                icon: record.status === 'PUBLISHED' ? <Clock className="w-4 h-4 text-amber-600" /> : <CheckCircle className="w-4 h-4 text-emerald-600" />,
                label: record.status === 'PUBLISHED' ? 'Unpublish to Draft' : 'Publish Page',
                onClick: () => handleTogglePublish(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                label: 'Delete Page',
                onClick: () => handleDelete(record.id),
              },
            ],
          }}
          trigger={['click']}
        >
          <Button type="text" icon={<MoreHorizontal className="w-4 h-4" />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Storefront Editorial Content</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">CMS Page Management</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenDrawer()}
          className="rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
        >
          Create New Page
        </Button>
      </div>

      {/* Default System Pages Cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Core Store Policy & Editorial Pages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {DEFAULT_PAGES.map((def) => {
            const Icon = def.icon;
            const existing = pagesData?.pages.find((p) => p.slug === def.slug);
            return (
              <div
                key={def.slug}
                onClick={() => handleSelectDefaultPageCard(def.slug)}
                className="cursor-pointer bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:shadow-md transition-all text-center group"
              >
                <div className={`p-2.5 rounded-xl border w-fit mx-auto mb-2 ${def.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-extrabold text-slate-900 dark:text-white text-xs block group-hover:text-indigo-600">
                  {def.title}
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                  {existing?.status || 'Not Configured'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search page title, slug or content..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Publication Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-44"
          allowClear
        >
          <Select.Option value="PUBLISHED">Published</Select.Option>
          <Select.Option value="DRAFT">Draft</Select.Option>
          <Select.Option value="ARCHIVED">Archived</Select.Option>
        </Select>
      </div>

      {/* CMS Pages Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={pagesData?.pages || []}
          columns={columns}
          rowKey="id"
          loading={isPagesLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: pagesData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Create / Edit Page Drawer */}
      <Drawer
        title={
          <span className="font-black text-slate-900 dark:text-white text-base">
            {editingPage ? `Edit Page — ${editingPage.title}` : 'Create New CMS Page'}
          </span>
        }
        placement="right"
        width={720}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={createPage.isPending || updatePage.isPending}
            className="bg-slate-900 dark:bg-indigo-600 font-bold rounded-xl"
          >
            Save Page
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="pt-2">
          <Tabs
            defaultActiveKey="content"
            items={[
              {
                key: 'content',
                label: <span className="font-bold text-xs">Page Content & Details</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <Form.Item
                        name="title"
                        label="Page Title"
                        rules={[{ required: true, message: 'Page title is required' }]}
                      >
                        <Input
                          placeholder="e.g. About Us"
                          onChange={(e) => {
                            if (!editingPage) {
                              const autoSlug = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/(^-|-$)/g, '');
                              form.setFieldValue('slug', autoSlug);
                            }
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        name="slug"
                        label="URL Slug (e.g. /about-us)"
                        rules={[{ required: true, message: 'Slug is required' }]}
                      >
                        <Input placeholder="about-us" className="font-mono text-xs" />
                      </Form.Item>
                    </div>

                    <Form.Item name="status" label="Publication Status" rules={[{ required: true }]}>
                      <Select>
                        <Select.Option value="PUBLISHED">Published Live</Select.Option>
                        <Select.Option value="DRAFT">Draft Mode</Select.Option>
                        <Select.Option value="ARCHIVED">Archived</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name="content"
                      label="Rich Text Article Content"
                      rules={[{ required: true, message: 'Page content is required' }]}
                    >
                      <RichTextEditor
                        value={form.getFieldValue('content')}
                        onChange={(val) => form.setFieldValue('content', val)}
                      />
                    </Form.Item>
                  </div>
                ),
              },
              {
                key: 'seo',
                label: <span className="font-bold text-xs">SEO Metadata</span>,
                children: (
                  <div className="space-y-4 pt-2">
                    <Form.Item name="metaTitle" label="SEO Title Tag">
                      <Input placeholder="e.g. About Us | Vistora Commerce Luxury Fashion" />
                    </Form.Item>

                    <Form.Item name="metaDescription" label="Meta Description">
                      <Input.TextArea
                        rows={3}
                        placeholder="Search engine snippet text (150-160 characters)..."
                      />
                    </Form.Item>

                    <Form.Item name="metaKeywords" label="Meta Keywords">
                      <Input placeholder="e.g. fashion, haute couture, luxury, about us" />
                    </Form.Item>
                  </div>
                ),
              },
            ]}
          />
        </Form>
      </Drawer>

      {/* CMS Live Preview Modal */}
      <CMSPreviewModal
        page={previewPage}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
