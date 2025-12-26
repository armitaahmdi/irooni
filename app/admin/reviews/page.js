"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ReviewsFilters from "@/components/admin/ReviewsFilters";
import ReviewsTable from "@/components/admin/ReviewsTable";
import ReviewDetailModal from "@/components/admin/ReviewDetailModal";
import { useAdminReviews } from "@/hooks/useAdminReviews";
import { useToast } from "@/components/providers/ToastProvider";

export default function AdminReviewsPage() {
  const { showToast } = useToast();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    reviewId: null,
    reviewComment: "",
    isLoading: false,
  });

  const reviewsData = useAdminReviews();

  const handleViewReview = (review) => {
    setSelectedReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteClick = (review) => {
    setDeleteModal({
      isOpen: true,
      reviewId: review.id,
      reviewComment: review.comment || "بدون متن",
      isLoading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.reviewId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    const success = await reviewsData.handleDelete(deleteModal.reviewId);
    if (success) {
      setDeleteModal({
        isOpen: false,
        reviewId: null,
        reviewComment: "",
        isLoading: false,
      });
    } else {
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  if (reviewsData.isLoading || !reviewsData.isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#286378] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeader title="مدیریت نظرات" />

        <ReviewsFilters
          searchQuery={reviewsData.searchQuery}
          setSearchQuery={reviewsData.setSearchQuery}
          filterStatus={reviewsData.filterStatus}
          setFilterStatus={reviewsData.setFilterStatus}
          onFilterChange={() => reviewsData.setCurrentPage(1)}
        />

        <ReviewsTable
          reviews={reviewsData.reviews}
          isLoading={reviewsData.isLoading}
          currentPage={reviewsData.currentPage}
          totalPages={reviewsData.totalPages}
          onPageChange={reviewsData.setCurrentPage}
          onView={handleViewReview}
          onApprove={reviewsData.handleApprove}
          onReject={reviewsData.handleReject}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* Review Details Modal */}
      <ReviewDetailModal
        isOpen={showReviewModal}
        review={selectedReview}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedReview(null);
        }}
        onApprove={reviewsData.handleApprove}
        onReject={reviewsData.handleReject}
        onDelete={handleDeleteClick}
        onReplySubmitted={() => {
          // Refresh reviews after reply
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({
            ...deleteModal,
            isOpen: false,
          })
        }
        onConfirm={handleDeleteConfirm}
        isLoading={deleteModal.isLoading}
        title="حذف نظر"
        description={`آیا از حذف این نظر اطمینان دارید؟ این عمل غیرقابل بازگشت است.`}
      />
    </div>
  );
}
