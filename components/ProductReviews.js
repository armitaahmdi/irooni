"use client";

import { useState } from "react";
import { useAuth } from "@/store/hooks";
import { useProductReviews } from "@/hooks/useProductReviews";
import { renderStars } from "@/utils/reviewHelpers";
import ReviewStats from "./product/ReviewStats";
import ReviewForm from "./product/ReviewForm";
import ReviewList from "./product/ReviewList";

/**
 * ProductReviews Component
 * Main component for displaying and managing product reviews
 */
export default function ProductReviews({ productId }) {
  const { isAuthenticated } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  const {
    reviews,
    stats,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    userVotes,
    handleHelpful,
    handleSubmitReview,
    handleReply,
  } = useProductReviews(productId);

  const handleReviewSubmit = async (reviewForm) => {
    setIsSubmitting(true);
    const success = await handleSubmitReview(reviewForm);
    setIsSubmitting(false);
    if (success) {
      setShowReviewForm(false);
    }
    return success;
  };

  const handleReplySubmit = async (reviewId, replyText) => {
    setIsSubmittingReply(true);
    const success = await handleReply(reviewId, replyText);
    setIsSubmittingReply(false);
    return success;
  };

  return (
    <div className="space-y-6">
      <ReviewStats stats={stats} renderStars={renderStars} />

      {isAuthenticated && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="w-full py-3 bg-gradient-to-r from-[#286378] to-[#43909A] text-white font-bold rounded-xl hover:from-[#43909A] hover:to-[#286378] transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          ثبت نظر جدید
        </button>
      )}

      {showReviewForm && (
        <ReviewForm
          onSubmit={handleReviewSubmit}
          onCancel={() => setShowReviewForm(false)}
          isSubmitting={isSubmitting}
        />
      )}

      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900">نظرات کاربران</h3>
        <ReviewList
          reviews={reviews}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          userVotes={userVotes}
          isAuthenticated={isAuthenticated}
          onHelpful={handleHelpful}
          onReply={handleReplySubmit}
          isSubmittingReply={isSubmittingReply}
        />
      </div>
    </div>
  );
}
