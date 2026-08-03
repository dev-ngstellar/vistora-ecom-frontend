'use client';

import React, { useState } from 'react';
import { useReviewDetails, useReviewMutations, useReviews, useReviewStats } from '@/hooks/use-sales';
import { Review } from '@/types/sales.types';
import { SalesStatCard } from '@/components/sales/sales-stat-card';
import { StatusBadge } from '@/components/sales/status-badge';
import {
  Table,
  Button,
  Input,
  Select,
  Modal,
  Drawer,
  Space,
  Form,
  Dropdown,
  Rate,
  Avatar,
  Tag,
} from 'antd';
import {
  Star,
  Check,
  X,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  MessageSquare,
  MoreHorizontal,
  Eye,
  Send,
  Package,
} from 'lucide-react';
import dayjs from 'dayjs';

export default function AdminReviewsPage() {
  const [search, setSearch] = useState('');
  const [ratingFilter, setRatingFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [isReplyDrawerOpen, setIsReplyDrawerOpen] = useState(false);

  const [replyForm] = Form.useForm();

  const { data: statsData, isLoading: isStatsLoading } = useReviewStats();
  const { data: reviewsData, isLoading: isReviewsLoading } = useReviews({
    search: search || undefined,
    rating: ratingFilter,
    status: statusFilter,
    page,
    limit,
  });

  const { data: reviewDetails, isLoading: isDetailsLoading } = useReviewDetails(
    selectedReviewId || ''
  );

  const { approveReview, rejectReview, deleteReview } = useReviewMutations();

  const handleApprove = (id: string) => {
    approveReview.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectReview.mutate(id);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Review',
      content: 'Are you sure you want to permanently delete this product review?',
      okText: 'Yes, Delete',
      okType: 'danger',
      onOk: () => deleteReview.mutate(id),
    });
  };

  const handleOpenReply = (id: string) => {
    setSelectedReviewId(id);
    replyForm.resetFields();
    setIsReplyDrawerOpen(true);
  };

  const columns = [
    {
      title: 'Product & Customer',
      dataIndex: 'product',
      key: 'product',
      render: (_: any, record: Review) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-400">
            👗
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              {record.product?.name || 'Unknown Product'}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              By: {record.user?.fullName} ({record.user?.email})
            </span>
          </div>
        </div>
      ),
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div className="flex items-center gap-1">
          <Rate disabled defaultValue={rating} className="text-xs text-amber-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1">
            {rating}.0
          </span>
        </div>
      ),
    },
    {
      title: 'Review Content',
      dataIndex: 'comment',
      key: 'comment',
      render: (_: any, record: Review) => (
        <div className="max-w-xs">
          {record.title && (
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              {record.title}
            </span>
          )}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-0.5">
            {record.comment || 'No written comment provided.'}
          </p>
        </div>
      ),
    },
    {
      title: 'Moderation Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusBadge status={status} category="review" />,
    },
    {
      title: 'Submitted Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <span className="text-xs text-slate-500">{dayjs(date).format('MMM D, YYYY')}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Review) => (
        <div className="flex items-center gap-1">
          {record.status === 'PENDING' && (
            <>
              <Button
                type="text"
                className="text-emerald-600 hover:bg-emerald-50"
                icon={<Check className="w-4 h-4" />}
                onClick={() => handleApprove(record.id)}
              />
              <Button
                type="text"
                danger
                icon={<X className="w-4 h-4" />}
                onClick={() => handleReject(record.id)}
              />
            </>
          )}

          <Dropdown
            menu={{
              items: [
                {
                  key: 'reply',
                  icon: <MessageSquare className="w-4 h-4 text-indigo-600" />,
                  label: 'View / Reply to Customer',
                  onClick: () => handleOpenReply(record.id),
                },
                {
                  key: 'approve',
                  disabled: record.status === 'APPROVED',
                  icon: <Check className="w-4 h-4 text-emerald-600" />,
                  label: 'Approve Review',
                  onClick: () => handleApprove(record.id),
                },
                {
                  key: 'reject',
                  disabled: record.status === 'REJECTED',
                  icon: <X className="w-4 h-4 text-rose-600" />,
                  label: 'Reject Review',
                  onClick: () => handleReject(record.id),
                },
                { type: 'divider' },
                {
                  key: 'delete',
                  danger: true,
                  icon: <Trash2 className="w-4 h-4" />,
                  label: 'Delete Review',
                  onClick: () => handleDelete(record.id),
                },
              ],
            }}
            trigger={['click']}
          >
            <Button type="text" icon={<MoreHorizontal className="w-4 h-4" />} />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Star className="w-4 h-4" />
            <span>Product Moderation & Feedback</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Review Management</h1>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SalesStatCard
          title="Total Reviews"
          value={statsData?.totalReviews || 0}
          icon={Star}
          colorScheme="indigo"
        />
        <SalesStatCard
          title="Pending Moderation"
          value={statsData?.pendingReviews || 0}
          icon={Clock}
          colorScheme="amber"
        />
        <SalesStatCard
          title="Approved Feedback"
          value={statsData?.approvedReviews || 0}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <SalesStatCard
          title="Average Rating"
          value={`${statsData?.avgRating || 0} ★`}
          icon={Star}
          colorScheme="purple"
        />
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-wrap items-center gap-4">
        <Input
          placeholder="Search by product name, review title or customer..."
          prefix={<Search className="w-4 h-4 text-slate-400 mr-1" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-2xl"
          allowClear
        />

        <Select
          placeholder="Filter Rating"
          value={ratingFilter}
          onChange={(val) => setRatingFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value={5}>5 Stars ★★★★★</Select.Option>
          <Select.Option value={4}>4 Stars ★★★★</Select.Option>
          <Select.Option value={3}>3 Stars ★★★</Select.Option>
          <Select.Option value={2}>2 Stars ★★</Select.Option>
          <Select.Option value={1}>1 Star ★</Select.Option>
        </Select>

        <Select
          placeholder="Moderation Status"
          value={statusFilter}
          onChange={(val) => setStatusFilter(val)}
          className="w-40"
          allowClear
        >
          <Select.Option value="PENDING">Pending</Select.Option>
          <Select.Option value="APPROVED">Approved</Select.Option>
          <Select.Option value="REJECTED">Rejected</Select.Option>
        </Select>
      </div>

      {/* Reviews Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <Table
          dataSource={reviewsData?.reviews || []}
          columns={columns}
          rowKey="id"
          loading={isReviewsLoading}
          pagination={{
            current: page,
            pageSize: limit,
            total: reviewsData?.meta?.total || 0,
            onChange: (p, l) => {
              setPage(p);
              setLimit(l);
            },
            showSizeChanger: true,
          }}
        />
      </div>

      {/* Reply & Details Drawer */}
      <Drawer
        title={
          reviewDetails ? (
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              <span className="font-black text-slate-900 dark:text-white text-sm">
                Review Details & Response
              </span>
            </div>
          ) : (
            'Review Moderation'
          )
        }
        placement="right"
        width={560}
        onClose={() => setIsReplyDrawerOpen(false)}
        open={isReplyDrawerOpen}
        loading={isDetailsLoading}
      >
        {reviewDetails && (
          <div className="space-y-6 text-xs">
            {/* Product Card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-xl">👗</div>
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                  {reviewDetails.product?.name}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">SKU: {reviewDetails.product?.sku}</span>
              </div>
            </div>

            {/* Review Box */}
            <div className="p-4 bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between">
                <Rate disabled defaultValue={reviewDetails.rating} className="text-xs text-amber-400" />
                <StatusBadge status={reviewDetails.status} category="review" />
              </div>

              {reviewDetails.title && (
                <h4 className="font-bold text-slate-900 dark:text-white text-sm pt-1">
                  "{reviewDetails.title}"
                </h4>
              )}

              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                {reviewDetails.comment || 'No comment text provided.'}
              </p>

              <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-700">
                <span>By: {reviewDetails.user?.fullName} ({reviewDetails.user?.email})</span>
                <span>{dayjs(reviewDetails.createdAt).format('MMM D, YYYY • h:mm A')}</span>
              </div>
            </div>

            {/* Official Store Reply Section */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <h4 className="font-black text-slate-900 dark:text-white text-sm mb-3">Store Representative Response</h4>
              <Form
                form={replyForm}
                layout="vertical"
                onFinish={() => {
                  Modal.success({
                    title: 'Response Saved',
                    content: 'Customer review reply has been updated.',
                  });
                  setIsReplyDrawerOpen(false);
                }}
              >
                <Form.Item
                  name="reply"
                  rules={[{ required: true, message: 'Please enter a response message' }]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Thank the customer for their review or address their product feedback..."
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Send className="w-4 h-4" />}
                  className="w-full rounded-2xl font-bold bg-slate-900 dark:bg-indigo-600"
                >
                  Post Public Response
                </Button>
              </Form>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
