'use client';

import React, { useState } from 'react';
import { Button, Modal, Tag, Input, message } from 'antd';
import { Star, Check, X, MessageSquare, ShieldCheck } from 'lucide-react';
import dayjs from 'dayjs';
import { useReviewMutations, useReviews } from '@/hooks/use-sales';
import { useReviewReport } from '@/hooks/use-reports';

interface ReviewItem {
  id: string;
  productName: string;
  customerName: string;
  rating: number;
  title?: string;
  comment: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

interface DashboardReviewsModerationProps {
  data?: ReviewItem[];
}

export const DashboardReviewsModeration: React.FC<DashboardReviewsModerationProps> = ({ data }) => {
  const { data: reportData } = useReviewReport();
  const { approveReview, rejectReview } = useReviewMutations();

  // Use props data first, then report data, or fallback to empty array
  const liveReviews: ReviewItem[] = data || (reportData?.recentReviews as any) || [];

  const [replyModalReview, setReplyModalReview] = useState<ReviewItem | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleApprove = (id: string) => {
    approveReview.mutate(id);
  };

  const handleReject = (id: string) => {
    rejectReview.mutate(id);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) {
      message.warning('Please enter a response before sending.');
      return;
    }
    message.success(`Reply sent to customer ${replyModalReview?.customerName}!`);
    setReplyModalReview(null);
    setReplyText('');
  };

  const pendingCount = liveReviews.filter((r) => r.status === 'PENDING').length;

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-black text-slate-900 dark:text-white text-base">Review Moderation Queue</h3>
            <p className="text-xs text-slate-500 font-medium">Customer feedback requiring store approval</p>
          </div>
          <Tag color={pendingCount > 0 ? 'gold' : 'green'} className="font-bold rounded-lg px-2.5 py-0.5 text-xs border-0">
            {pendingCount > 0 ? `${pendingCount} Pending` : 'All Clean'}
          </Tag>
        </div>

        {liveReviews.length === 0 ? (
          <div className="py-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No pending customer reviews</p>
            <p className="text-[11px] text-slate-400 mt-0.5">All customer feedback has been moderated</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {liveReviews.slice(0, 4).map((rev) => (
              <div
                key={rev.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-900 dark:text-white block">{rev.productName}</span>
                    <span className="text-[11px] text-slate-400">By {rev.customerName} • {dayjs(rev.createdAt).format('MMM D, YYYY')}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 dark:text-slate-300 italic">"{rev.comment}"</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-800">
                  <Tag
                    color={rev.status === 'APPROVED' ? 'green' : rev.status === 'REJECTED' ? 'red' : 'orange'}
                    className="font-bold text-[10px] rounded-md border-0"
                  >
                    {rev.status}
                  </Tag>

                  {rev.status === 'PENDING' && (
                    <div className="flex items-center gap-1">
                      <Button
                        size="small"
                        type="primary"
                        icon={<Check className="w-3.5 h-3.5" />}
                        loading={approveReview.isPending}
                        onClick={() => handleApprove(rev.id)}
                        className="bg-emerald-600 font-bold text-[11px] rounded-xl"
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        danger
                        icon={<X className="w-3.5 h-3.5" />}
                        loading={rejectReview.isPending}
                        onClick={() => handleReject(rev.id)}
                        className="font-bold text-[11px] rounded-xl"
                      >
                        Reject
                      </Button>
                      <Button
                        size="small"
                        type="default"
                        icon={<MessageSquare className="w-3.5 h-3.5" />}
                        onClick={() => setReplyModalReview(rev)}
                        className="font-bold text-[11px] rounded-xl"
                      >
                        Reply
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reply Modal */}
      <Modal
        title={`Reply to ${replyModalReview?.customerName}`}
        open={Boolean(replyModalReview)}
        onCancel={() => setReplyModalReview(null)}
        onOk={handleSendReply}
        okText="Send Public Reply"
      >
        <div className="py-2 space-y-3">
          <p className="text-xs text-slate-500 italic">"{replyModalReview?.comment}"</p>
          <Input.TextArea
            rows={4}
            placeholder="Write concierge store response..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
