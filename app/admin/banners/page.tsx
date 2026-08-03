'use client';

import React, { useState } from 'react';
import { useBannerDetails, useBannerMutations, useBanners } from '@/hooks/use-content';
import { Banner } from '@/types/content.types';
import { ImageUpload } from '@/components/content/image-upload';
import { BannerPreviewModal } from '@/components/content/banner-preview-modal';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Form,
  InputNumber,
  Switch,
  DatePicker,
  Dropdown,
  Tag,
  Space,
} from 'antd';
import {
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Layers,
  Calendar,
  Sparkles,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminBannersPage() {
  const [search, setSearch] = useState('');
  const [positionFilter, setPositionFilter] = useState<string | undefined>(undefined);
  const [activeFilter, setActiveFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [form] = Form.useForm();

  const { data: bannersData, isLoading: isBannersLoading } = useBanners({
    search: search || undefined,
    position: positionFilter,
    isActive: activeFilter,
    page,
    limit,
  });

  const { createBanner, updateBanner, toggleStatus, deleteBanner } = useBannerMutations();

  const handleOpenModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      form.setFieldsValue({
        title: banner.title,
        subtitle: banner.subtitle,
        imageUrl: banner.imageUrl,
        mobileImageUrl: banner.mobileImageUrl,
        position: banner.position,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        sortOrder: banner.sortOrder,
        isActive: banner.isActive,
        startDate: banner.startDate ? dayjs(banner.startDate) : undefined,
        endDate: banner.endDate ? dayjs(banner.endDate) : undefined,
      });
    } else {
      setEditingBanner(null);
      form.resetFields();
      form.setFieldsValue({
        position: 'HERO_SLIDER',
        sortOrder: 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values: any) => {
    const payload = {
      ...values,
      startDate: values.startDate ? values.startDate.toISOString() : null,
      endDate: values.endDate ? values.endDate.toISOString() : null,
    };

    if (editingBanner) {
      await updateBanner.mutateAsync({ id: editingBanner.id, data: payload });
    } else {
      await createBanner.mutateAsync(payload);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleToggleActive = (banner: Banner) => {
    toggleStatus.mutate({ id: banner.id, isActive: !banner.isActive });
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Banner',
      content: 'Are you sure you want to delete this promo banner?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteBanner.mutate(id),
    });
  };

  const handleOpenPreview = (banner: Banner) => {
    setPreviewBanner(banner);
    setIsPreviewOpen(true);
  };

  const columns = [
    {
      title: 'Banner Thumbnail & Title',
      dataIndex: 'title',
      key: 'title',
      render: (_: any, record: Banner) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0">
            <img src={record.imageUrl} alt={record.title} className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white block text-xs">
              {record.title}
            </span>
            {record.subtitle && (
              <span className="text-[11px] text-slate-500 font-medium line-clamp-1">
                {record.subtitle}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
      render: (pos: string) => (
        <Tag color="geekblue" className="font-bold rounded-lg text-xs border-0">
          {pos.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'CTA Button & Destination',
      dataIndex: 'buttonText',
      key: 'buttonText',
      render: (text: string | null, record: Banner) => (
        <div className="text-xs">
          <span className="font-bold text-slate-900 dark:text-white block">
            {text || 'No CTA Button'}
          </span>
          {record.buttonLink && (
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-mono">
              {record.buttonLink}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      render: (order: number) => (
        <span className="font-black text-slate-900 dark:text-white text-xs">#{order}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: Banner) => (
        <div className="flex items-center gap-2">
          <Tag color={isActive ? 'green' : 'orange'} className="font-bold rounded-lg border-0 text-xs">
            {isActive ? 'Active' : 'Inactive'}
          </Tag>
          <Switch
            size="small"
            checked={isActive}
            onChange={() => handleToggleActive(record)}
          />
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Banner) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'preview',
                icon: <Eye className="w-4 h-4 text-indigo-600" />,
                label: 'Preview Device View',
                onClick: () => handleOpenPreview(record),
              },
              {
                key: 'edit',
                icon: <Edit className="w-4 h-4 text-emerald-600" />,
                label: 'Edit Banner',
                onClick: () => handleOpenModal(record),
              },
              { type: 'divider' },
              {
                key: 'delete',
                danger: true,
                icon: <Trash2 className="w-4 h-4" />,
                label: 'Delete Banner',
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
            <ImageIcon className="w-4 h-4" />
            <span>Storefront Visual Marketing</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Banner Management</h1>
        </div>

        <Button
          type="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => handleOpenModal()}
          className="rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
        >
          Add New Banner
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by banner title or subtitle..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Banner Position"
          value={positionFilter}
          onChange={(val) => setPositionFilter(val)}
          className="w-44"
          allowClear
        >
          <Select.Option value="HERO_SLIDER">Hero Slider</Select.Option>
          <Select.Option value="PROMO_GRID">Promo Grid</Select.Option>
          <Select.Option value="TOP_BAR">Top Bar Announcement</Select.Option>
          <Select.Option value="FOOTER_BANNER">Footer Banner</Select.Option>
        </Select>

        <Select
          placeholder="Active Status"
          value={activeFilter !== undefined ? (activeFilter ? 'true' : 'false') : undefined}
          onChange={(val) => setActiveFilter(val ? val === 'true' : undefined)}
          className="w-36"
          allowClear
        >
          <Select.Option value="true">Active Only</Select.Option>
          <Select.Option value="false">Inactive Only</Select.Option>
        </Select>
      </div>

      {/* Banners Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={bannersData?.banners || []}
          columns={columns}
          rowKey="id"
          loading={isBannersLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: bannersData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Create / Edit Drawer */}
      <Drawer
        title={
          <span className="font-black text-slate-900 dark:text-white text-base">
            {editingBanner ? 'Edit Banner' : 'Create New Promotional Banner'}
          </span>
        }
        placement="right"
        width={580}
        onClose={() => setIsModalOpen(false)}
        open={isModalOpen}
        extra={
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={createBanner.isPending || updateBanner.isPending}
            className="bg-slate-900 dark:bg-indigo-600 font-bold rounded-xl"
          >
            Save Banner
          </Button>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} className="space-y-4 pt-2">
          <Form.Item
            name="title"
            label="Banner Headline Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="e.g. Haute Couture Autumn Collection 2026" />
          </Form.Item>

          <Form.Item name="subtitle" label="Subtitle / Supporting Copy">
            <Input placeholder="e.g. Handcrafted Italian silk gowns and cashmere outerwear." />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="position" label="Display Position" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="HERO_SLIDER">Hero Slider Carousel</Select.Option>
                <Select.Option value="PROMO_GRID">Promo Grid Banner</Select.Option>
                <Select.Option value="TOP_BAR">Top Bar Announcement</Select.Option>
                <Select.Option value="FOOTER_BANNER">Footer Promo Banner</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="sortOrder" label="Display Priority Order">
              <InputNumber min={0} className="w-full" placeholder="0 = Highest Priority" />
            </Form.Item>
          </div>

          {/* Desktop Image */}
          <Form.Item
            name="imageUrl"
            label="Desktop Banner Asset"
            rules={[{ required: true, message: 'Desktop image URL is required' }]}
          >
            <ImageUpload
              label="Desktop Image (16:9 or 21:9 ratio)"
              recommendedAspect="1920 x 1080 (HD)"
              value={form.getFieldValue('imageUrl')}
              onChange={(url) => form.setFieldValue('imageUrl', url)}
            />
          </Form.Item>

          {/* Mobile Image */}
          <Form.Item name="mobileImageUrl" label="Mobile Banner Asset (Optional)">
            <ImageUpload
              label="Mobile Image (Vertical 4:5 ratio)"
              recommendedAspect="800 x 1000 (Portrait)"
              value={form.getFieldValue('mobileImageUrl')}
              onChange={(url) => form.setFieldValue('mobileImageUrl', url)}
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="buttonText" label="CTA Button Label">
              <Input placeholder="e.g. Explore Collection" />
            </Form.Item>

            <Form.Item name="buttonLink" label="CTA Target URL / Route">
              <Input placeholder="e.g. /shop?collection=autumn" />
            </Form.Item>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="startDate" label="Schedule Start Date">
              <DatePicker showTime className="w-full" />
            </Form.Item>

            <Form.Item name="endDate" label="Schedule End Date">
              <DatePicker showTime className="w-full" />
            </Form.Item>
          </div>

          <Form.Item name="isActive" valuePropName="checked" label="Publication Status">
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <Switch checked={form.getFieldValue('isActive')} onChange={(checked) => form.setFieldValue('isActive', checked)} />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {form.getFieldValue('isActive') ? 'Published & Active' : 'Draft / Hidden'}
              </span>
            </div>
          </Form.Item>
        </Form>
      </Drawer>

      {/* Banner Preview Modal */}
      <BannerPreviewModal
        banner={previewBanner}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
