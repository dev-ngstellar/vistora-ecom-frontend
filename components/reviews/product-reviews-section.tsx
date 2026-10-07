'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  ShieldCheck,
  PenLine,
  ThumbsUp,
  X,
  MessageSquare,
  Sparkles,
  Filter,
  ArrowUpDown,
  UserCheck,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { useProductReviews, useCreateReview } from '@/hooks/use-sales';
import { Review, ReviewSummary } from '@/types/sales.types';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

interface ProductReviewsSectionProps {
  productId: string;
  productName: string;
  onSummaryLoaded?: (summary: ReviewSummary) => void;
}

const RATING_DESCRIPTIONS: Record<number, string> = {
  1: 'Poor — Did not meet expectations',
  2: 'Fair — Needs improvement',
  3: 'Average — Satisfactory quality',
  4: 'Very Good — Impressive freshness',
  5: 'Exceptional — Highly recommended!',
};

export function ProductReviewsSection({
  productId,
  productName,
  onSummaryLoaded,
}: ProductReviewsSectionProps) {
  const { user, requireCustomerAuth } = useAuth();

  // Filters, Sorting & View Density
  const [activeStarFilter, setActiveStarFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'compact' | 'list'>('compact');
  const [showAll, setShowAll] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  // Review Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formTitle, setFormTitle] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Local interaction state
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, boolean>>({});

  // Query reviews
  const {
    data: reviewsResponse,
    isLoading,
  } = useProductReviews(productId, {
    rating: activeStarFilter ?? undefined,
    sort: sortBy,
  });

  const createReviewMutation = useCreateReview();

  const reviews: Review[] = reviewsResponse?.reviews || [];
  const summary: ReviewSummary = reviewsResponse?.summary || {
    totalReviews: reviews.length,
    averageRating: reviews.length > 0 ? 5 : 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    recommendedPercentage: 100,
  };

  // Limit visible items in compact view
  const VISIBLE_COUNT = 4;
  const displayedReviews = showAll ? reviews : reviews.slice(0, VISIBLE_COUNT);

  // Notify parent component of summary stats if requested
  React.useEffect(() => {
    if (reviewsResponse?.summary && onSummaryLoaded) {
      onSummaryLoaded(reviewsResponse.summary);
    }
  }, [reviewsResponse?.summary, onSummaryLoaded]);

  const handleOpenWriteReview = () => {
    requireCustomerAuth(() => {
      setFormError(null);
      setIsModalOpen(true);
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormTitle('');
    setFormComment('');
    setFormRating(5);
    setFormError(null);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formRating < 1 || formRating > 5) {
      setFormError('Please select a star rating from 1 to 5');
      return;
    }

    try {
      await createReviewMutation.mutateAsync({
        productId,
        rating: formRating,
        title: formTitle.trim() || undefined,
        comment: formComment.trim() || undefined,
      });

      handleCloseModal();
    } catch {
      // Handled in mutation onError
    }
  };

  const toggleHelpful = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const toggleExpandComment = (reviewId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const totalReviewsCount = summary.totalReviews || 0;
  const avgRatingNum = summary.averageRating || 0;

  return (
    <section id="reviews" className="scroll-mt-24 space-y-4 pt-5">
      {/* SECTION HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 border-b border-[#E5E7EB] pb-2.5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#A50025]">
              Customer Experiences
            </span>
            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> 100% Genuine Reviews
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#111827] tracking-tight mt-0.5">
            Ratings & Customer Reviews
          </h2>
        </div>

        <button
          onClick={handleOpenWriteReview}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#A50025] hover:bg-[#85001E] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider shadow-2xs transition-all shrink-0"
        >
          <PenLine className="w-3.5 h-3.5" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* COMPACT SUMMARY DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Card 1: Score Snapshot (4 Cols) */}
        <div className="md:col-span-4 bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-between">
          <div className="space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
              Overall Score
            </span>
            <div className="flex items-baseline gap-2.5">
              <span className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
                {totalReviewsCount > 0 ? avgRatingNum.toFixed(1) : '5.0'}
              </span>
              <span className="text-xs font-semibold text-[#64748B]">out of 5.0</span>
            </div>

            {/* Stars row */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(totalReviewsCount > 0 ? avgRatingNum : 5)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200 fill-slate-100'
                  }`}
                />
              ))}
              <span className="text-xs font-bold text-[#111827] ml-1.5">
                {totalReviewsCount} {totalReviewsCount === 1 ? 'review' : 'reviews'}
              </span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
            <span className="text-[#64748B] font-medium">Recommendation</span>
            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 text-[10px]">
              {summary.recommendedPercentage}% Recommend
            </span>
          </div>
        </div>

        {/* Card 2: Rating Breakdown Bars (5 Cols) */}
        <div className="md:col-span-5 bg-white rounded-xl border border-[#E5E7EB] p-4 shadow-2xs flex flex-col justify-center">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
              Rating Breakdown
            </span>
            {activeStarFilter && (
              <button
                onClick={() => setActiveStarFilter(null)}
                className="text-[10px] font-bold text-[#A50025] hover:underline"
              >
                Clear filter ({activeStarFilter}★)
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = summary.distribution?.[star] || 0;
              const percent = summary.percentages?.[star] || 0;
              const isSelected = activeStarFilter === star;

              return (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setActiveStarFilter((prev) => (prev === star ? null : star))
                  }
                  className={`w-full flex items-center gap-2 group text-left px-1.5 py-0.5 -mx-1.5 rounded-lg transition-colors ${
                    isSelected ? 'bg-amber-50 ring-1 ring-amber-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-0.5 w-8 text-xs font-bold text-[#334155] shrink-0">
                    <span>{star}</span>
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>

                  {/* Progress bar container */}
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isSelected
                          ? 'bg-amber-500'
                          : star >= 4
                          ? 'bg-emerald-500 group-hover:bg-emerald-600'
                          : star === 3
                          ? 'bg-amber-400 group-hover:bg-amber-500'
                          : 'bg-rose-400 group-hover:bg-rose-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className="w-11 text-right text-[10px] font-medium text-[#64748B] shrink-0">
                    {count} ({percent}%)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 3: Direct Review Callout (3 Cols) */}
        <div className="md:col-span-3 bg-gradient-to-br from-[#FFF6F8] to-[#FFF0F3] rounded-xl border border-[#FCE7EB] p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-white border border-[#F8D2DA] flex items-center justify-center text-[#A50025] shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-black text-[#111827] uppercase tracking-wide">
                Have you tried this?
              </h3>
            </div>
            <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
              Share your honest feedback to help fellow food lovers make the best choice.
            </p>
          </div>

          <button
            onClick={handleOpenWriteReview}
            className="w-full mt-3 h-8 rounded-lg border border-[#A50025] text-[#A50025] hover:bg-[#A50025] hover:text-white transition-all text-[11px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-2xs"
          >
            <PenLine className="w-3 h-3" />
            <span>Leave a Review</span>
          </button>
        </div>
      </div>

      {/* COMPACT FILTER & SORT CONTROLS BAR */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-2.5 flex flex-col sm:flex-row items-center justify-between gap-2.5 shadow-2xs">
        {/* Star Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-0.5 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
            <Filter className="w-3 h-3" /> Filter:
          </span>

          <button
            onClick={() => setActiveStarFilter(null)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeStarFilter === null
                ? 'bg-[#111827] text-white shadow-2xs'
                : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
            }`}
          >
            All ({totalReviewsCount})
          </button>

          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.distribution?.[star] || 0;
            const isSelected = activeStarFilter === star;

            return (
              <button
                key={star}
                onClick={() =>
                  setActiveStarFilter((prev) => (prev === star ? null : star))
                }
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-900 shadow-2xs'
                    : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                }`}
              >
                <span>{star}★</span>
                <span className="text-[10px] opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Sort & View Mode Controls */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider flex items-center gap-1">
              <ArrowUpDown className="w-3 h-3" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs font-bold text-[#111827] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-[#A50025]"
            >
              <option value="newest">Most Recent</option>
              <option value="highest">Highest Rating</option>
              <option value="lowest">Lowest Rating</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          {/* View Density Mode Toggle (Compact Grid vs List) */}
          <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('compact')}
              className={`p-1 rounded-md transition ${
                viewMode === 'compact'
                  ? 'bg-white text-[#A50025] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Compact 2-Column Grid"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1 rounded-md transition ${
                viewMode === 'list'
                  ? 'bg-white text-[#A50025] shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Single-Column List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS CONTENT */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E5E7EB] p-4 animate-pulse space-y-2.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div className="space-y-1 flex-1">
                  <div className="w-24 h-3 bg-slate-200 rounded-sm" />
                  <div className="w-16 h-2 bg-slate-100 rounded-sm" />
                </div>
              </div>
              <div className="w-36 h-3 bg-slate-200 rounded-sm" />
              <div className="w-full h-8 bg-slate-100 rounded-sm" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center shadow-2xs space-y-2.5">
          <div className="w-12 h-12 rounded-xl bg-[#FFF6F0] border border-[#FFE2D1] flex items-center justify-center text-[#E66001] mx-auto shadow-2xs">
            <MessageSquare className="w-6 h-6" />
          </div>

          <h3 className="text-sm sm:text-base font-black text-[#111827]">
            {activeStarFilter
              ? `No ${activeStarFilter}-Star Reviews Found`
              : 'Be the First to Review This Product!'}
          </h3>

          <p className="text-xs text-[#64748B] font-medium max-w-md mx-auto leading-relaxed">
            {activeStarFilter
              ? 'There are currently no reviews matching this rating tier. Select "All" to view other reviews.'
              : 'Share your tasting notes, aroma impressions, or recipes to assist fellow gourmet buyers.'}
          </p>

          <div className="pt-1">
            {activeStarFilter ? (
              <button
                onClick={() => setActiveStarFilter(null)}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition"
              >
                Clear Rating Filter
              </button>
            ) : (
              <button
                onClick={handleOpenWriteReview}
                className="px-4 py-2 rounded-xl bg-[#A50025] hover:bg-[#85001E] text-white text-xs font-black uppercase tracking-wider shadow-2xs transition"
              >
                Write First Review
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* COMPACT REVIEWS GRID / LIST */}
          <div
            className={
              viewMode === 'compact'
                ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
                : 'space-y-2.5'
            }
          >
            {displayedReviews.map((rev) => {
              const userName =
                rev.user?.fullName ||
                (rev.user?.firstName && `${rev.user.firstName} ${rev.user.lastName || ''}`.trim()) ||
                'Verified Shopper';

              const userInitial = userName.charAt(0).toUpperCase();
              const formattedDate = dayjs(rev.createdAt).format('MMM D, YYYY');
              const isHelpful = Boolean(helpfulVotes[rev.id]);
              const isExpanded = Boolean(expandedComments[rev.id]);

              return (
                <article
                  key={rev.id}
                  className="bg-white rounded-xl border border-[#E5E7EB] p-3.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-2"
                >
                  <div>
                    {/* Header: User, Verified Badge & Rating Star Pill */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* 32px Compact Avatar */}
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#A50025] to-[#E66001] flex items-center justify-center text-white font-black text-xs shrink-0 shadow-2xs">
                          {userInitial}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-extrabold text-[#111827] truncate">
                              {userName}
                            </span>

                            {rev.isVerifiedBuyer !== false && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>

                          <div className="text-[10px] text-[#94A3B8] font-medium">
                            {formattedDate}
                          </div>
                        </div>
                      </div>

                      {/* Rating Star Badge */}
                      <div className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-md text-amber-900 font-black text-xs shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    {/* Review Title & Comment */}
                    <div className="pt-1.5 space-y-1">
                      {rev.title && (
                        <h4 className="text-xs font-black text-[#111827] tracking-tight line-clamp-1">
                          {rev.title}
                        </h4>
                      )}

                      {rev.comment && (
                        <div>
                          <p
                            className={`text-xs text-[#475569] font-medium leading-relaxed ${
                              !isExpanded && 'line-clamp-2'
                            }`}
                          >
                            {rev.comment}
                          </p>
                          {rev.comment.length > 110 && (
                            <button
                              onClick={() => toggleExpandComment(rev.id)}
                              className="text-[10px] font-bold text-[#A50025] hover:underline mt-0.5"
                            >
                              {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compact Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px]">
                    <span className="text-[#94A3B8] font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Authenticated
                    </span>

                    <button
                      onClick={() => toggleHelpful(rev.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                        isHelpful
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'text-[#64748B] hover:bg-slate-100 hover:text-[#111827]'
                      }`}
                    >
                      <ThumbsUp className={`w-3 h-3 ${isHelpful ? 'fill-emerald-600' : ''}`} />
                      <span>{isHelpful ? 'Helpful (1)' : 'Helpful'}</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* SHOW MORE / SHOW LESS EXPANSION BAR */}
          {reviews.length > VISIBLE_COUNT && (
            <div className="flex justify-center pt-1.5">
              <button
                onClick={() => setShowAll((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-black text-[#111827] uppercase tracking-wider transition-all shadow-2xs active:scale-[0.98]"
              >
                {showAll ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#A50025]" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5 text-[#A50025]" />
                    <span>
                      View All {reviews.length} Reviews ({reviews.length - VISIBLE_COUNT} more)
                    </span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* WRITE A REVIEW MODAL */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="bg-white rounded-3xl border border-[#E5E7EB] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#E5E7EB] bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F3] border border-[#FCE7EB] flex items-center justify-center text-[#A50025]">
                  <PenLine className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#111827] tracking-tight">
                    Write Product Review
                  </h3>
                  <p className="text-[11px] text-[#64748B] font-medium line-clamp-1">
                    {productName}
                  </p>
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmitReview} className="p-5 sm:p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {formError}
                </div>
              )}

              {/* Star Rating Selector */}
              <div className="space-y-2 text-center bg-amber-50/50 border border-amber-200/60 p-4 rounded-2xl">
                <label className="block text-xs font-black uppercase tracking-wider text-[#111827]">
                  Your Overall Rating
                </label>

                <div className="flex items-center justify-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = (hoverRating || formRating) >= star;
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFormRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                      >
                        <Star
                          className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                            isFilled
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 fill-slate-100'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <p className="text-xs font-bold text-amber-900 pt-1">
                  {RATING_DESCRIPTIONS[hoverRating || formRating]}
                </p>
              </div>

              {/* Review Headline / Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111827]">
                  Review Headline <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  maxLength={120}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g., Pure organic aroma and incredible freshness!"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#A50025]/20 focus:border-[#A50025] transition"
                />
              </div>

              {/* Detailed Review Comment */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#111827]">
                  Detailed Experience <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  rows={4}
                  maxLength={2000}
                  value={formComment}
                  onChange={(e) => setFormComment(e.target.value)}
                  placeholder="How was the texture, flavor, cooking quality, or packaging? Would you recommend this to a friend?"
                  className="w-full text-xs font-medium p-3.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#A50025]/20 focus:border-[#A50025] transition leading-relaxed resize-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Honest opinions help the entire Vistora community</span>
                  <span>{formComment.length}/2000</span>
                </div>
              </div>

              {/* Authenticated user indicator */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-[#111827]">
                    Posting as {user?.firstName} {user?.lastName}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">{user?.email}</span>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={createReviewMutation.isPending}
                  className="px-5 py-2.5 rounded-xl bg-[#A50025] hover:bg-[#85001E] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                >
                  {createReviewMutation.isPending ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Review</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
