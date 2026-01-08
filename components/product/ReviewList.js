"use client";

import { Star, Loader2 } from "lucide-react";
import ReviewItem from "./ReviewItem";

/**
 * ReviewList Component
 * List of reviews with pagination
 */
export default function ReviewList({
  reviews,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  userVotes,
  isAuthenticated,
  onHelpful,
  onReply,
  isSubmittingReply,
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 text-[#286378] animate-spin" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl">
        <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">هنوز نظری ثبت نشده است</p>
        <p className="text-sm text-gray-500 mt-2">اولین نفری باشید که نظر می‌دهد</p>
      </div>
    );
  }

  return (
    <>
      {reviews.map((review) => (
        <ReviewItem
          key={review.id}
          review={review}
          userVote={userVotes[review.id]}
          isAuthenticated={isAuthenticated}
          onHelpful={onHelpful}
          onReply={onReply}
          isSubmittingReply={isSubmittingReply}
        />
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            قبلی
          </button>
          <span className="px-4 py-2 text-gray-700">
            صفحه {currentPage} از {totalPages}
          </span>
          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            بعدی
          </button>
        </div>
      )}
    </>
  );
}

